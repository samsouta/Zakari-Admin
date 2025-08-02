export type FilterItem = {
    label: string;
    value: string | boolean;
}

export const filterItems: FilterItem[] = [
    {
        label: 'All',
        value: 'all',
    },
    {
        label: 'Account',
        value: 'account',
    },
    {
        label: 'Coin',
        value: 'coin',
    },
]

export const productFilterItems: FilterItem[] = [
    {
        label: 'All',
        value: 'all',
    },
    {
        label: 'Account',
        value: 'account',
    },
    {
        label: 'Coin',
        value: 'coin',
    },
    {
        label: 'Sold',
        value: true,
    },
    {
        label: 'Available',
        value: false,
    },
]