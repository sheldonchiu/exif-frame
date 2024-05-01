import Photo from '../../core/photo';
import { Store } from '../../store';
import sandbox from '../../core/drawing/sandbox';
import { ThemeFunc } from '../../core/drawing/theme';
import { ThemeOption, ThemeOptionInput } from '../../pages/theme/types/theme-option';

const FILM_OPTIONS: ThemeOption[] = [
  { id: 'TEXT_COLOR', type: 'color', default: '#FFA500', description: 'default is orange hex code' },
  { id: 'BACKGROUND_COLOR', type: 'color', default: '#000000', description: '#ffffff is white, #000000 is black' },
  { id: 'PADDING_TOP', type: 'number', default: 0, description: 'px' },
  { id: 'PADDING_BOTTOM', type: 'number', default: 0, description: 'px' },
  { id: 'PADDING_LEFT', type: 'number', default: 0, description: 'px' },
  { id: 'PADDING_RIGHT', type: 'number', default: 0, description: 'px' },
];

const FILM_FUNC: ThemeFunc = (photo: Photo, input: ThemeOptionInput, store: Store) => {
  const TEXT_COLOR = input.get('TEXT_COLOR') as string;
  const BACKGROUND_COLOR = (input.get('BACKGROUND_COLOR') as string).trim();
  const PADDING_TOP = input.get('PADDING_TOP') as number;
  const PADDING_BOTTOM = input.get('PADDING_BOTTOM') as number;
  const PADDING_LEFT = input.get('PADDING_LEFT') as number;
  const PADDING_RIGHT = input.get('PADDING_RIGHT') as number;

  const canvas = sandbox(photo, {
    targetRatio: store.ratio,
    notCroppedMode: store.notCroppedMode,
    backgroundColor: BACKGROUND_COLOR,
    padding: { top: PADDING_TOP, right: PADDING_RIGHT, bottom: PADDING_BOTTOM, left: PADDING_LEFT },
  });

  const context = canvas.getContext('2d')!;
  context.fillStyle = TEXT_COLOR;
  context.textBaseline = 'bottom';

  if (!store.disableExposureMeter) {
    const datas = [
      ...(photo.iso ? [{ key: 'ISO', value: photo.iso.replace('ISO', '') }] : []),
      ...(photo.exposureTime ? [{ key: 'SEC', value: photo.exposureTime.replace('s', '') }] : []),
      ...(photo.fNumber ? [{ key: 'F', value: photo.fNumber.replace('F', '') }] : []),
    ];

    context.textAlign = 'right';
    context.font = `100px digital-7`;
    for (let i = 0; i < datas.length; i++) {
      const data = datas[i];
      context.fillText(data.value, canvas.width - 100, canvas.height - 100 - i * 100);
      const width = context.measureText(data.value).width;
      context.font = `70px digital-7`;
      context.fillText(data.key, canvas.width - 100 - width - 20, canvas.height - 105 - i * 100);
      context.font = `100px digital-7`;
    }
  }

  context.font = `70px digital-7`;
  context.textAlign = 'left';
  context.fillText(
    [store.showLensModel ? store.overrideLensModel || photo.lensModel : null]
      .filter(Boolean)
      .map((value) => value!.trim())
      .join(' '),
    100,
    canvas.height - 105
  );
  context.fillText(
    [store.showCameraMaker ? store.overrideCameraMaker || photo.make : null, store.showCameraModel ? store.overrideCameraModel || photo.model : null]
      .filter(Boolean)
      .map((value) => value!.trim())
      .join(' '),
    100,
    canvas.height - 205
  );

  return canvas;
};

export { FILM_FUNC, FILM_OPTIONS };
