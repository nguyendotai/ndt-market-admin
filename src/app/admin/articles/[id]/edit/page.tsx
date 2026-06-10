import { ArticleFormPage } from "@/modules/articles/pages/ArticleFormPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <ArticleFormPage articleId={id} />;
}
