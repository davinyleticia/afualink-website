// components/organisms/Hero.tsx
import Button from '@/components/atoms/Button/Button';

export const Hero = () => {
  return (
    <section className="pt-32 pb-20 bg-white">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-[#003366] text-4xl md:text-5xl font-black leading-tight">
            Otimize processos, inove com tecnologia e conquiste resultado personalizado!
          </h1>
          <p className="text-gray-600 text-lg">
            Transforme sua empresa com nossas soluções de consultoria em TI!
          </p>
          <Button href="/produtos" variant="primary">Veja os Nossos Produtos</Button>
        </div>
        <div className="md:w-1/2 flex justify-center">
          {/* Imagem ilustrativa do notebook e engrenagens conforme o print */}
          <img src="/img1.jpg" alt="Inovação Tecnológica" className="max-w-full h-auto" />
        </div>
      </div>
    </section>
  );
};