import { Router, Request, Response } from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase';

const router = Router();

// GET all active vendors
router.get('/', async (req: Request, res: Response) => {
  if (!isSupabaseConfigured || !supabase) {
    return res.json({
      status: 'standby',
      message: 'Supabase credentials pending. Ready to query public.vendors once configured.',
      data: []
    });
  }

  try {
    const { locality, category } = req.query;
    let query = supabase.from('vendors').select('*').eq('status', 'active');

    if (locality) query = query.eq('locality', locality);
    if (category) query = query.eq('category', category);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET vendor by slug
router.get('/:slug', async (req: Request, res: Response) => {
  if (!isSupabaseConfigured || !supabase) {
    return res.json({
      status: 'standby',
      message: `Ready to query vendor: ${req.params.slug}`,
      data: null
    });
  }

  try {
    const { data, error } = await supabase
      .from('vendors')
      .select('*, products(*)')
      .eq('slug', req.params.slug)
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

