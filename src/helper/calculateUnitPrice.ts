
/**
 * Calculate the final unit price after applying discounts
 */
export const calculateUnitPrice = (price: number, discountPercentage?: number | null, discountPrice?: number | null): number => {
    if (discountPrice && discountPrice > 0) {
        return price - discountPrice;
    }
    if (discountPercentage && discountPercentage > 0) {
        return Math.floor(price - (price * (discountPercentage / 100)));
    }
    return Math.floor(price);
};