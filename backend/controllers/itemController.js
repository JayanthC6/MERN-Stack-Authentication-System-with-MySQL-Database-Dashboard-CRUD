const db = require('../config/db');

// --- 1. CREATE ITEM ---
exports.createItem = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const [result] = await db.query(
            'INSERT INTO items (user_id, title, description, status) VALUES (?, ?, ?, ?)',
            [req.user.id, title, description, status || 'active']
        );

        res.status(201).json({
            message: 'Item created successfully',
            itemId: result.insertId
        });

    } catch (error) {
        console.error('Create Item Error:', error);
        res.status(500).json({ message: 'Server error creating item' });
    }
};

// --- 2. READ: GET ALL ITEMS FOR LOGGED IN USER ---
exports.getItems = async (req, res) => {
    try {
        const [items] = await db.query(
            'SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        
        res.status(200).json(items);
    } catch (error) {
        console.error('Get Items Error:', error);
        res.status(500).json({ message: 'Server error fetching items' });
    }
};

// --- 3. UPDATE ITEM ---
exports.updateItem = async (req, res) => {
    try {
        const itemId = req.params.id; 
        const { title, description, status } = req.body;

        // Security: Check if item exists AND belongs to this user
        const [item] = await db.query('SELECT * FROM items WHERE id = ? AND user_id = ?', [itemId, req.user.id]);
        
        if (item.length === 0) {
            return res.status(404).json({ message: 'Item not found or unauthorized' });
        }

        await db.query(
            'UPDATE items SET title = ?, description = ?, status = ? WHERE id = ?',
            [title || item[0].title, description || item[0].description, status || item[0].status, itemId]
        );

        res.status(200).json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error('Update Item Error:', error);
        res.status(500).json({ message: 'Server error updating item' });
    }
};

// --- 4. DELETE ITEM ---
exports.deleteItem = async (req, res) => {
    try {
        const itemId = req.params.id;

        // Security: Check if item exists AND belongs to this user
        const [item] = await db.query('SELECT * FROM items WHERE id = ? AND user_id = ?', [itemId, req.user.id]);
        
        if (item.length === 0) {
            return res.status(404).json({ message: 'Item not found or unauthorized' });
        }

        await db.query('DELETE FROM items WHERE id = ?', [itemId]);

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Delete Item Error:', error);
        res.status(500).json({ message: 'Server error deleting item' });
    }
};

// --- 5. GET STATS ---
exports.getStats = async (req, res) => {
    try {
        // Fetch all items for this user to calculate stats
        const [items] = await db.query('SELECT status FROM items WHERE user_id = ?', [req.user.id]);
        
        const stats = {
            total: items.length,
            active: items.filter(i => i.status === 'active').length,
            pending: items.filter(i => i.status === 'pending').length,
            completed: items.filter(i => i.status === 'completed').length
        };
        
        res.status(200).json(stats);
    } catch (error) {
        console.error('Get Stats Error:', error);
        res.status(500).json({ message: 'Server error fetching statistics' });
    }
};