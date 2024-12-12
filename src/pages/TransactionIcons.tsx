// TransactionIcons.ts
import { 
    fastFood, 
    car, 
    home, 
    shirt, 
    medical, 
    gameController,
    airplane,
    cart,
    wallet,
    cash,
    business,
    gift,
    // Add more icons as needed
  } from 'ionicons/icons';

  
  export const tagIcons: { [key: string]: string } = {
    'Food': fastFood,
    'Transport': car,
    'Housing': home,
    'Shopping': shirt,
    'Healthcare': medical,
    'Entertainment': gameController,
    'Travel': airplane,
    'Groceries': cart,
    'Salary': wallet,
    'Investment': business,
    'Gift': gift,
    default: cash
    // Add more mappings as needed
  };