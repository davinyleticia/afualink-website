import Button from "../../atoms/Button/Button";


const CallToActionV2 = () => {
  return (
<section className="py-20 bg-[#003366] text-white">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para transformar sua empresa?</h2>
    <p className="text-blue-100 mb-10 max-w-xl mx-auto text-lg">
      Junte-se a dezenas de empresas que já otimizaram seus resultados com a Afulink.
    </p>
    <div className="flex flex-wrap justify-center gap-4">
      <Button href="/contato" variant="primary">Solicitar Orçamento</Button>
      {/* <a href="https://wa.me/seunumeroaqui" className="border-2 border-white/30 hover:bg-white/10 px-8 py-3 rounded-full font-bold transition-all">
        Falar no WhatsApp
      </a> */}
    </div>
  </div>
</section>
  );
};

export default CallToActionV2;











