import { Router, Request, Response } from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase';

const router = Router();

// GET products (optional filtering by category, vendorId)
router.get('/', async (req: Request, res: Response) => {
  if (!isSupabaseConfigured || !supabase) {
    return res.json({
      status: 'standby',
      message: 'Supabase credentials pending. Ready to query public.products once configured.',
      data: []
    });
  }

  try {
    const { category, vendorId } = req.query;
    let query = supabase.from('products').select('*').eq('status', 'published');

    if (category) query = query.eq('category', category);
    if (vendorId) query = query.eq('vendor_id', vendorId);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single product by slug
router.get('/:slug', async (req: Request, res: Response) => {
  if (!isSupabaseConfigured || !supabase) {
    return res.json({
      status: 'standby',
      message: `Ready to query product: ${req.params.slug}`,
      data: null
    });
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, vendors(name, locality, address)')
      .eq('slug', req.params.slug)
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

