import Image from "next/image";

interface GalleryItem {
  image: string;
  title: string;
  subtitle?: string;
}

interface ImageGalleryProps {
  main: GalleryItem;
  items: GalleryItem[];
}

export default function ImageGallery({ main, items }: ImageGalleryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl sm:aspect-[16/9]">
        <Image
          src={main.image}
          alt={main.title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy-deep/10 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h3 className="text-xl font-bold">{main.title}</h3>
          {main.subtitle && (
            <p className="mt-1 text-sm text-white/80">{main.subtitle}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="group relative aspect-[4/3] overflow-hidden rounded-3xl"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy-deep/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-sm font-semibold">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
