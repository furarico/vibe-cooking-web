import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { RecipeHoverCard } from '../recipe-hover-card';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({
    src,
    alt,
    fill,
    sizes,
    className,
    ...props
  }: {
    src: string;
    alt?: string;
    fill?: boolean;
    sizes?: string;
    className?: string;
    [key: string]: unknown;
  }) {
    return (
      <img
        src={src}
        alt={alt || ''}
        className={className}
        data-fill={fill}
        data-sizes={sizes}
        {...props}
      />
    );
  },
}));

describe('RecipeHoverCard', () => {
  const defaultProps = {
    title: 'テストレシピ',
    description: 'テストレシピの説明文です',
    tags: ['#rice', '#test'],
    cookingTime: '30min',
    imageUrl: '/test-image.jpg',
    imageAlt: 'テスト画像',
  };

  it('should render all props correctly', () => {
    render(<RecipeHoverCard {...defaultProps} />);

    // Check title
    expect(screen.getByText('テストレシピ')).toBeInTheDocument();

    // Check description
    expect(screen.getByText('テストレシピの説明文です')).toBeInTheDocument();

    // Check tags
    expect(screen.getByText('#rice')).toBeInTheDocument();
    expect(screen.getByText('#test')).toBeInTheDocument();

    // Check cooking time
    expect(screen.getByText('30min')).toBeInTheDocument();

    // Check image
    const image = screen.getByAltText('テスト画像');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('should render timer with cooking time', () => {
    render(<RecipeHoverCard {...defaultProps} />);

    // Check that timer section is rendered with cooking time
    expect(screen.getByText('30min')).toBeInTheDocument();

    // Check that timer icon class is present in the DOM
    const timerElement = document.querySelector('.lucide-timer');
    expect(timerElement).not.toBeNull();
  });

  it('should apply custom className', () => {
    const customClass = 'custom-test-class';
    const { container } = render(
      <RecipeHoverCard {...defaultProps} className={customClass} />
    );

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass(customClass);
  });

  it('should use default imageAlt when not provided', () => {
    const propsWithoutAlt = {
      title: defaultProps.title,
      description: defaultProps.description,
      tags: defaultProps.tags,
      cookingTime: defaultProps.cookingTime,
      imageUrl: defaultProps.imageUrl,
    };

    render(<RecipeHoverCard {...propsWithoutAlt} />);

    const image = screen.getByRole('presentation');
    expect(image).toHaveAttribute('alt', '');
  });

  it('should render multiple tags correctly', () => {
    const propsWithManyTags = {
      ...defaultProps,
      tags: ['#rice', '#okinawa', '#tomato', '#spicy'],
    };

    render(<RecipeHoverCard {...propsWithManyTags} />);

    expect(screen.getByText('#rice')).toBeInTheDocument();
    expect(screen.getByText('#okinawa')).toBeInTheDocument();
    expect(screen.getByText('#tomato')).toBeInTheDocument();
    expect(screen.getByText('#spicy')).toBeInTheDocument();
  });

  it('should forward ref correctly', () => {
    const ref = { current: null };
    render(<RecipeHoverCard {...defaultProps} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
