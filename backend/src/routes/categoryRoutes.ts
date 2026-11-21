import { Router, Request, Response } from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase';

const router = Router();

// GET categories
router.get('/', async (req: Request, res: Response) => {
  if (!isSupabaseConfigured || !supabase) {
    return res.json({
      status: 'standby',
      message: 'Supabase credentials pending.',
      data: [
        { id: 'dairy', name: 'Milk & Dairy', icon: '🥛', count: 48 },
        { id: 'eggs', name: 'Farm Fresh Eggs', icon: '🥚', count: 24 },
        { id: 'veggies', name: 'Vegetables & Fruits', icon: '🥬', count: 96 },
        { id: 'groceries', name: 'Groceries & Staples', icon: '🌾', count: 140 },
        { id: 'meat', name: 'Meat & Seafood', icon: '🥩', count: 32 },
        { id: 'bakery', name: 'Bread & Bakes', icon: '🍞', count: 29 },
      ]
    });
  }

  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

