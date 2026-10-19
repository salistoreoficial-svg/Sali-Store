-- Execute no SQL Editor do Supabase uma única vez.
ALTER TABLE public.sali_categorias ADD COLUMN IF NOT EXISTS imagem_url text;
ALTER TABLE public.sali_categorias ADD COLUMN IF NOT EXISTS ordem integer DEFAULT 100;
INSERT INTO public.sali_categorias (nome,ordem) VALUES
 ('Vestidos longos',1),('Vestidos curtos',2),('Blusas',3),('Conjuntos',4),('Saias',5),('Bodys',6)
ON CONFLICT (nome) DO UPDATE SET ordem=EXCLUDED.ordem;
DROP POLICY IF EXISTS "SALI admin atualiza categorias" ON public.sali_categorias;
CREATE POLICY "SALI admin atualiza categorias" ON public.sali_categorias FOR UPDATE TO authenticated
USING (EXISTS(SELECT 1 FROM public.sali_roles WHERE user_id=auth.uid() AND lower(role)='admin'))
WITH CHECK (EXISTS(SELECT 1 FROM public.sali_roles WHERE user_id=auth.uid() AND lower(role)='admin'));
DROP POLICY IF EXISTS "SALI admin exclui categorias" ON public.sali_categorias;
CREATE POLICY "SALI admin exclui categorias" ON public.sali_categorias FOR DELETE TO authenticated
USING (EXISTS(SELECT 1 FROM public.sali_roles WHERE user_id=auth.uid() AND lower(role)='admin'));
