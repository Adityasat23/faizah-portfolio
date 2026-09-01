import localFont from 'next/font/local';

export const helvetica = localFont({
  src: [
    {
      path: '../../public/fonts/HelveticaNeueLight.ttf',
      weight: '300',
      style: 'normal',
    },
    // TODO: Include Italic font files once provided to avoid synthetic/faux browser italics.
    // {
    //   path: '../../public/fonts/HelveticaNeueLightItalic.ttf',
    //   weight: '300',
    //   style: 'italic',
    // },
    // {
    //   path: '../../public/fonts/HelveticaNeueMedium.ttf',
    //   weight: '500',
    //   style: 'normal',
    // },
    {
      path: '../../public/fonts/HelveticaNeueBold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-helvetica',
  display: 'swap',
  fallback: ['-apple-system', 'Inter', 'sans-serif'],
});
