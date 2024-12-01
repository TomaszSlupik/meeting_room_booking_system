import {styled,} from '@mui/system';

const Wrapperheader = styled('div')(({theme}) => ({
    [theme.breakpoints.up('xs')] : {
        position: 'absolute',
        top: '0%',
        width: '100vw',
        height: '50px',
        background: 'linear-gradient(145deg, #2c2c2c, #1f1f1f)',
    }, 
    [theme.breakpoints.up('sm')] : {
    }, 
    [theme.breakpoints.up('md')] : {
    }, 
    [theme.breakpoints.up('lg')] : {
    }, 
    [theme.breakpoints.up('xl')] : {
    }, 

}))

export default Wrapperheader