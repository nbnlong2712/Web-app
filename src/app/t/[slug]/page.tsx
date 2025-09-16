// Tool detail page (ISR)
export default async function ToolDetailPage(context: { params: Promise<{ slug: string }> }) {
  const params = await context.params;
  return <div>Tool Detail Page for {params.slug}</div>
}