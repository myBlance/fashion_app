import React, { useRef, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ProductCard from './ProductCard';
import { products } from '../../data/products';

    const HotDeals: React.FC = () => {
    const productWidth = 220;
    const productMarginRight = 16;
    const visibleCount = 5;
    const containerWidth = visibleCount * (productWidth + productMarginRight);

    const scrollRef = useRef<HTMLDivElement>(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const [isDragging, setIsDragging] = useState(false);

    const onMouseDown = (e: React.MouseEvent) => {
        isDown.current = true;
        setIsDragging(false);
        startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
        scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
    };

    const onMouseLeave = () => {
        isDown.current = false;
    };

    const onMouseUp = () => {
        isDown.current = false;
        setTimeout(() => setIsDragging(false), 0);
        window.getSelection()?.removeAllRanges();
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDown.current || !scrollRef.current) return;
            const x = e.pageX - scrollRef.current.offsetLeft;
            const walk = (x - startX.current) * 1;
            scrollRef.current.scrollLeft = scrollLeft.current - walk;

        if (Math.abs(walk) > 5) {
            setIsDragging(true);
        }
    };

    const handleClickCapture = (e: React.MouseEvent) => {
        if (isDragging) {
            e.stopPropagation();
            e.preventDefault();
        }
    };

    const scrollByOneProduct = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
            const scrollAmount = productWidth + productMarginRight;
        if (direction === 'left') {
            scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <Box p={4} >
            <Typography variant="h4" fontWeight="bold" gutterBottom align='center'>
                Deal nổi bật 🔥
            </Typography>
            <Typography variant="body2" mb={3} align='center'>
                Chương trình đã kết thúc, hẹn gặp lại trong thời gian sớm nhất!
            </Typography>

            <Box display="flex" alignItems="center" gap={1} justifyContent="center">
                <IconButton
                    onClick={() => scrollByOneProduct('left')}
                    aria-label="scroll left"
                    size="large"
                >
                    <ChevronLeftIcon />
                </IconButton>

                <Box
                    ref={scrollRef}
                    display="flex"
                    onMouseDown={onMouseDown}
                    onMouseLeave={onMouseLeave}
                    onMouseUp={onMouseUp}
                    onMouseMove={onMouseMove}
                    onClickCapture={handleClickCapture}
                    sx={{
                        overflowX: 'auto',
                        width: containerWidth,
                        cursor: isDown.current ? 'grabbing' : 'grab',
                        userSelect: 'none',
                        WebkitUserDrag: 'none',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        '&::-webkit-scrollbar': 
                        {
                            display: 'none',
                        },
                    }}
                >
                    {products
                        .filter(product => product.sale === true)
                        .map(product => (
                            <Box
                                key={product.id}
                                flex="0 0 auto"
                                sx={{ minWidth: productWidth, pl:1 , mr:1, mb: 2, mt: 2 }}
                            >
                                <ProductCard product={{...product, status: product.status ? 'true' : 'false'}} />
                            </Box>
                    ))}

                </Box>

                <IconButton
                    onClick={() => scrollByOneProduct('right')}
                    aria-label="scroll right"
                    size="large"
                >
                    <ChevronRightIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default HotDeals;
