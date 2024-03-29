'use client';

import '@/app/globals.css';
import Toc from '@/components/toc';
import { PokemonToc, Region } from '@/components/util/type';
import { promises as fs } from 'fs';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import type { AppProps } from 'next/app';
import { DotGothic16, Kosugi_Maru } from 'next/font/google';
import Head from 'next/head';

const kosugiMaru = Kosugi_Maru({
  weight: ['400'],
  subsets: ['latin'],
});

const dotGothic16 = DotGothic16({
  weight: ['400'],
  subsets: ['latin'],
});

type Param = {
  pokemonTocs: PokemonToc[];
  regions: Region[];
};

export const getStaticProps = (async (context) => {
  const file1 = await fs.readFile(process.cwd() + '/api/pokemon-list.json', 'utf8');
  const pokemonTocs: PokemonToc[] = JSON.parse(file1);
  const file2 = await fs.readFile(process.cwd() + '/api/regions.json', 'utf8');
  const regions: Region[] = JSON.parse(file2);
  const param = { pokemonTocs, regions };
  return { props: { param } };
}) satisfies GetStaticProps<{
  param: Param;
}>;

const Home = ({
  Component,
  pageProps,
  param,
}: AppProps & InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="theme-color" content="#428cee" />
      </Head>
      <main
        className={`grid grid-cols-[290px_1100px] grid-rows-[160px_240px_440px] gap-2 ${kosugiMaru.className}`}
      >
        <Toc pokemonTocs={param.pokemonTocs} regions={param.regions} no={null} form={null} />
        <section className={`speech-bubble p-2 text-4xl leading-[4rem] ${dotGothic16.className}`}>
          <p>見たいポケモンを選ぶロト！</p>
          <p>ポケモンの地方を選択したり、名前で検索もできるロト！</p>
        </section>
      </main>
    </>
  );
};

export default Home;
