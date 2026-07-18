import React from 'react';
import { render } from '@testing-library/react';
import promotionImages from './slide';

describe('slide.js', () => {
    it('should export an array of image paths', () => {
        const DummyComponent = () => (
            <div>
                {promotionImages.map((image, index) => (
                    <img key={index} src={image} alt={`slide${index + 1}`} />
                ))}
            </div>
        );

        const { getAllByRole } = render(<DummyComponent />);
        const images = getAllByRole('img');

        expect(images.length).toBe(promotionImages.length);
        images.forEach((img, index) => {
            expect(img).toHaveAttribute('src', promotionImages[index]);
        });
    });
});
