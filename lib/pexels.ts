// NOTE: Use Pexel if OpenAI provided photos are not good enough

export async function getDestinationImage(query: string) {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=1`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY!,
        },
      }
    );

    const data = await res.json();

    return (
      data.photos?.[0]?.src?.large ||
      "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg"
    );
  } catch (error) {
    console.error(error);

    return "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg";
  }
}