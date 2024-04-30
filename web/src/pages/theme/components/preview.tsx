import render from '../../../core/drawing/render';
import { useEffect } from 'react';
import { useStore } from '../../../store';
import themes from '../../../themes';
import { ThemeOptionInput, getConverter } from '../types/theme-option';
import Customize from '../database/customize';
import free from '../../../core/drawing/free';

const Preview = () => {
  const store = useStore();
  const { selectedThemeName, rerenderOptions, tabIndex } = useStore();

  useEffect(() => {
    const preview = document.getElementById('preview') as HTMLCanvasElement;
    preview.width = 0;
    preview.height = 0;

    if (store.photos.length === 0) return;
    if (tabIndex !== 1) return;

    const input: ThemeOptionInput = new Map<string, string | number | boolean>();
    const theme = themes.find((theme) => theme.name === selectedThemeName);
    theme?.options.forEach((option) => {
      const value = Customize.get(selectedThemeName, option.id, getConverter(option.type));
      if (value !== null) {
        input.set(option.id, value);
      } else {
        input.set(option.id, option.default);
      }
    });

    const func = theme?.func;

    render(func!, store.photos[0], input, store).then((canvas) => {
      const ratio = canvas.width / canvas.height;
      preview.width = 1000;
      preview.height = 1000 / ratio;
      preview.getContext('2d')?.drawImage(canvas, 0, 0, preview.width, preview.height);
      free(canvas);
      canvas.remove();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedThemeName, rerenderOptions, tabIndex]);

  return <canvas id="preview" className="mx-auto mt-4" style={{ width: '500px' }} />;
};

export default Preview;
