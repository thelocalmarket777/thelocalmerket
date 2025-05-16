import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';

const showcaseContent = {
  'heritage-books': {
    title: 'Nepali Heritage Books',
    subtitle: 'Preserving Stories Through Generations',
    hero: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353',
    features: [
      { title: 'Hand-bound', description: 'Traditional Nepali binding techniques' },
      { title: 'Local Paper', description: 'Made from Lokta bark' },
      { title: 'Authentic Content', description: 'Written by local historians' }
    ],
    materials: {
      title: 'Crafting Materials',
      items: ['Lokta Paper', 'Natural Dyes', 'Cotton Thread', 'Wooden Covers'],
      description: 'Every material is sourced locally from sustainable suppliers'
    },
    story: [
      {
        heading: 'Preserving Our Heritage',
        content: 'Each book in our heritage collection tells a unique story of Nepal\'s rich cultural tapestry. From ancient traditions to modern interpretations, our carefully curated selection brings history to life.',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'
      },
      {
        heading: 'Handcrafted with Care',
        content: 'Our books are crafted using traditional Nepali papermaking techniques, preserving age-old craftsmanship while telling contemporary stories.',
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570'
      }
    ],
    pricing: {
      range: 'Rs. 1,500 - Rs. 5,000',
      note: 'Prices vary based on size and complexity'
    },
    process: [
      { step: 1, title: 'Paper Making', description: 'Traditional Lokta processing' },
      { step: 2, title: 'Content Creation', description: 'Research and documentation' },
      { step: 3, title: 'Illustration', description: 'Hand-drawn artwork' },
      { step: 4, title: 'Assembly', description: 'Traditional binding process' }
    ],
    makingProcess: {
      title: 'The Art of Book Making',
      steps: [
        {
          title: 'Paper Selection',
          description: 'Our artisans carefully select the finest Lokta paper, known for its durability and unique texture.',
          image: 'https://images.unsplash.com/photo-1576758090116-1a8f33779722'
        },
        {
          title: 'Traditional Binding',
          description: 'Using age-old Nepali techniques, each page is hand-stitched with locally sourced cotton thread.',
          image: 'https://images.unsplash.com/photo-1589831377283-33cb1cc6bd5d'
        }
      ]
    },
    artisans: [
      {
        name: 'Master Ram Bahadur',
        expertise: '40 years of bookbinding',
        story: 'Learning the craft from his grandfather, Ram has dedicated his life to preserving traditional bookmaking.',
        image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a'
      }
    ],
    timeline: [
      { year: '1950', event: 'First traditional binding workshop established' },
      { year: '1975', event: 'Introduction of Lokta paper preservation techniques' },
      { year: '2000', event: 'Modern adaptation of ancient binding methods' },
      { year: 'Today', event: 'Blending tradition with contemporary designs' }
    ],
    videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID',
    gallery: [
      {
        title: 'Ancient Sanskrit Text',
        image: 'https://images.unsplash.com/photo-1589123053646-4e8b0c552487'
      },
      {
        title: 'Traditional Binding',
        image: 'https://images.unsplash.com/photo-1592634244339-809d45f1dd25'
      }
    ]
  },
  'traditional-crafts': {
    title: 'Traditional Crafting',
    hero: 'https://images.unsplash.com/photo-1528484786961-e60586bc5837',
    story: [
      {
        heading: 'Artisan Excellence',
        content: 'Our craftsmen combine generations of expertise with innovative designs, creating pieces that honor Nepali traditions while embracing modern aesthetics.',
        imageUrl: 'https://images.unsplash.com/photo-1462927114214-6956d2fddd4e'
      },
      {
        heading: 'Sustainable Practices',
        content: 'Each piece is created using locally sourced materials, supporting local communities and ensuring sustainable production methods.',
        imageUrl: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b'
      }
    ]
  },
  'banbo': {
    title: 'Authentic Banbo',
    hero: 'https://images.unsplash.com/photo-1529401915656-5b890f13b968',
    story: [
      {
        heading: 'Traditional Bamboo Craft',
        content: 'Banbo represents the pinnacle of Nepali bamboo craftsmanship, where each piece tells a story of skill passed down through generations.',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b'
      },
      {
        heading: 'Modern Functionality',
        content: 'While maintaining traditional techniques, our Banbo products are designed to meet contemporary needs and aesthetics.',
        imageUrl: 'https://images.unsplash.com/photo-1509307191386-b0bf1fc15f9d'
      }
    ]
  }
};

export default function LocalProductShowcase() {
  const { category } = useParams();
  const navigate = useNavigate();
  const content = showcaseContent[category as keyof typeof showcaseContent];

  if (!content) return <div>Category not found</div>;

  return (
    <MainLayout>
      <div className="relative">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            className="hover:bg-gray-100"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Hero Section */}
        <div className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-black/50 z-10"/>
          <img 
            src={content.hero} 
            alt={content.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-4">
              {content.title}
            </h1>
            <p className="text-xl text-white/90">{content.subtitle}</p>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.features?.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Materials Section */}
        {content.materials && (
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-8">{content.materials.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {content.materials.items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 text-center">
                  <p className="font-medium">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-gray-600">{content.materials.description}</p>
          </div>
        )}

        {/* Story Sections */}
        <div className="container mx-auto px-4 py-16">
          {content.story.map((section, index) => (
            <div 
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } gap-8 mb-16 items-center`}
            >
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">{section.heading}</h2>
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </div>
              <div className="flex-1">
                <img 
                  src={section.imageUrl} 
                  alt={section.heading}
                  className="rounded-lg shadow-lg w-full h-[400px] object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Video Section */}
        {content.videoUrl && (
          <div className="bg-gray-900 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-white mb-12">
                Watch Our Crafting Process
              </h2>
              <div className="aspect-w-16 aspect-h-9 max-w-4xl mx-auto">
                <iframe
                  src={content.videoUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg shadow-2xl"
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Section */}
        {content.gallery && (
          <div className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Product Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.gallery.map((item, index) => (
                  <div 
                    key={index} 
                    className="group relative aspect-square overflow-hidden rounded-lg"
                  >
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                      <p className="text-white text-lg font-medium">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Process Section */}
        {content.process && (
          <div className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center">Our Process</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {content.process.map((step) => (
                  <div key={step.step} className="relative">
                    <div className="text-4xl font-bold text-indigo-600 mb-4">
                      {step.step.toString().padStart(2, '0')}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Making Process Section */}
        {content.makingProcess && (
          <div className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">{content.makingProcess.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {content.makingProcess.steps.map((step, index) => (
                  <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Artisan Section */}
        {content.artisans && (
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Meet Our Artisans</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {content.artisans.map((artisan, index) => (
                <div key={index} className="max-w-sm bg-white rounded-xl shadow-lg overflow-hidden">
                  <img 
                    src={artisan.image} 
                    alt={artisan.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{artisan.name}</h3>
                    <p className="text-indigo-600 mb-3">{artisan.expertise}</p>
                    <p className="text-gray-600">{artisan.story}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline Section */}
        {content.timeline && (
          <div className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Our Heritage Journey</h2>
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-indigo-200"></div>
                {content.timeline.map((item, index) => (
                  <div key={index} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-8`}>
                    <div className="w-1/2 relative px-8">
                      <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-indigo-600 transform translate-x-[-50%]"></div>
                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <span className="text-indigo-600 font-bold">{item.year}</span>
                        <p className="mt-2">{item.event}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Section */}
        {content.pricing && (
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Pricing</h2>
            <p className="text-2xl text-indigo-600 font-semibold mb-2">
              {content.pricing.range}
            </p>
            <p className="text-gray-600">{content.pricing.note}</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
