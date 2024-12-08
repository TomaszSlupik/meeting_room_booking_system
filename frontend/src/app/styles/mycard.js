import {positions, styled} from '@mui/system';

const Mycard = styled('div')(({theme}) => ({
    [theme.breakpoints.up('xs')]: {
        width: '90%',
        maxWidth: '100%',
        minHeight: '440px',
        height: 'auto',
        background: 'linear-gradient(145deg, #2c2c2c, #1f1f1f)',
        borderRadius: '15px',
        color: '#fff',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        padding: '15px',
        margin: '3em 0em'
    },
    '@media (min-width: 762px)': {
        width: '90%',
    },
    '@media (min-width: 992px)': {
        width: '480px',
        padding: '20px',
    },
    '@media (min-width: 1200px)': {
        width: '570px',
    },
    '@media (min-width: 1200px)': {
        width: '690px',
    },
    '@media (min-width: 2100px)': {
        width: '900px',
    },
}));

export default Mycard;
