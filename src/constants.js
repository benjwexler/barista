
export const ESPRESSO = 'espresso';
export const HOT_WATER = 'hotWater';
export const STEAMED_MILK = 'steamedMilk';
export const FOAM = 'foam';
export const brown = '#724d32';

const _drinks = [
  {
    value: 'espresso',
    label: 'Espresso',
  },
  {
    value: 'americano',
    label: 'Americano',
  },
  {
    value: 'latte',
    label: 'Latte',
  },
  {
    value: 'cappuccino',
    label: 'Cappuccino',
  },
  {
    value: 'macchiato',
    label: 'Macchiato',
  },
  {
    value: 'red-eye',
    label: 'Red-Eye',
  },
  {
    value: 'mocha',
    label: 'Mocha',
  }
];

export const drinks = _drinks.sort(function(a, b) {
  var textA = a.value.toUpperCase();
  var textB = b.value.toUpperCase();
  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
});

export const getIngredientsForDrink = (drink) => {
  switch (drink) {
    case 'espresso':
      return ['espresso'];
    case 'americano':
      return ['espresso', 'hotWater'];
    case 'latte':
    case 'cappuccino':
      return ['espresso', 'steamedMilk', 'foam'];
    case 'macchiato':
      return ['espresso', 'foam'];
    case 'red-eye':
      return ['espresso', 'drip-coffee'];
    case 'mocha':
      return ['espresso', 'chocolate', 'steamedMilk', 'whipped-cream']
    default:
      return [];
  }
}

