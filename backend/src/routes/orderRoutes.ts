import { Router, Request, Response } from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase';

const router = Router();

// POST new order
router.post('/', async (req: Request, res: Response) => {
  if (!isSupabaseConfigured || !supabase) {
    return res.status(200).json({
      success: true,
      status: 'simulated',
      message: 'Order received. Will be saved to Supabase once credentials are configured.',
      order: {
        id: `TRG-${Math.floor(100000 + Math.random() * 900000)}`,
        ...req.body,
        createdAt: new Date().toISOString()
      }
    });
  }

  try {
    const { data, error } = await supabase.from('orders').insert([req.body]).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, order: data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET order by ID
router.get('/:id', async (req: Request, res: Response) => {
  if (!isSupabaseConfigured || !supabase) {
    return res.json({
      status: 'standby',
      message: `Ready to query order: ${req.params.id}`,
      data: null
    });
  }

  try {
    const { data, error } = await supabase.from('orders').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

