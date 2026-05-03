import CardProduct from '../CardProduct';
import {HeroProduct1, HeroProduct2, HeroProduct3} from '~/assets/images';

export default function ProductSection() {
  return (
    <section
      id="product-section"
      className="min-h-screen max-w-full px-6 flex flex-col items-center justify-center gap-6 md:gap-10"
    >
      <h2 className="font-display text-5xl text-black tracking-tight">
        Your choice. Our quality.
      </h2>
      <div className="grid grid-cols-3 gap-4 max-w-7xl w-full">
        <CardProduct
          image={HeroProduct1}
          title={'Nilson Extended'}
          desc={
            'Matte black, hung with intention, built for rooms that mean something.'
          }
          price={122}
          subtitle={'New A dome of calm'}
        />
        <CardProduct
          image={HeroProduct2}
          title={'Simple Extended'}
          desc={
            'Simple Life Collection Designed for spaces that speak quietly but look deeply considered'
          }
          price={122}
          subtitle={'New A dome of calm'}
        />
        <CardProduct
          image={HeroProduct3}
          title={'Modren Nilson'}
          desc={
            'New Drop The Nilson Extended is a matte black pendant that turns any ceiling into a statement.'
          }
          price={122}
          subtitle={'New A dome of calm'}
        />
      </div>
    </section>
  );
}
