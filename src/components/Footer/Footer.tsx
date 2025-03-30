import React from 'react';
import { Box, Typography, IconButton, Link, Stack, useTheme, useMediaQuery } from '@mui/material';
import { FaFacebook as FacebookIcon, FaInstagram as InstagramIcon, FaYoutube as YoutubeIcon } from 'react-icons/fa6';

const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#81d742',
        color: 'white',
        py: { xs: 3, md: 2 }, // menor altura no desktop
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={4}
        justifyContent="center"
        alignItems="center"
        mb={2}
      >
        <Link href="/" underline="hover" color="inherit" fontSize={{ xs: '0.9rem', md: '1rem' }}>Início</Link>
        <Link href="/sobre" underline="hover" color="inherit" fontSize={{ xs: '0.9rem', md: '1rem' }}>Sobre</Link>
        <Link href="/eventos" underline="hover" color="inherit" fontSize={{ xs: '0.9rem', md: '1rem' }}>Eventos</Link>
        <Link href="/contato" underline="hover" color="inherit" fontSize={{ xs: '0.9rem', md: '1rem' }}>Contato</Link>
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
        <IconButton
          component="a"
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
        >
          <FacebookIcon size={20} />
        </IconButton>
        <IconButton
          component="a"
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
        >
          <InstagramIcon size={20} />
        </IconButton>
        <IconButton
          component="a"
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
        >
          <YoutubeIcon size={20} />
        </IconButton>
      </Stack>

      <Typography
        variant="body2"
        sx={{
          fontSize: { xs: '0.75rem', md: '0.875rem' },
          px: { xs: 2, md: 0 },
          textAlign: 'center',
          width: '100%',
        }}
      >
        © 2025 Clubinhos NIB. Todos os direitos reservados.
      </Typography>
    </Box>
  );
};

export default Footer;
