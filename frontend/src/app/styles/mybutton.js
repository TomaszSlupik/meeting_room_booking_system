import {styled,} from '@mui/system';

const Mybutton = styled('button')(({theme}) => ({
    [theme.breakpoints.up('xs')] : {
        minWidth: '120px', 
        minHeight: '35px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        textAlign: 'center',
        textTransform: 'uppercase',
        border: '2px solid #fff', 
        backgroundColor: 'transparent',
        color: '#fff', 
        borderRadius: '4px', 
        transition: 'all 0.3s ease', 
        '&:hover': {
          backgroundColor: '#fff', 
          color: 'black', 
          borderColor: '#fff', 
        },
        '&:focus': {
            outline: 'none', 
            boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.8)',
          },
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

export default Mybutton