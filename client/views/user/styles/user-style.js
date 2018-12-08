import avatarBg from './bg.jpg'

export default () => {
  return {
    root: {},
    avatar: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundImage: `url(${avatarBg})`,
      // backgroundSize: 'cover',
      padding: 20,
      paddingTop: 60,
      paddingBottom: 100,
    },
    avatarImg: {
      width: 80,
      height: 80,
      margin: 'auto',
      marginBottom: 20,
      marginTop: 20,
      position: 'relative',
      zIndex: '1'
    },
    userName: {
      color: '#fff',
      position: 'relative',
      zIndex: '1',
    },
    bg: {
      backgroundImage: `url(${avatarBg})`,
      backgroundSize: 'cover',
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      textAlign: 'center',
      '&::after': {
        content: '\' \'',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,.6)',
      },
    },
  }
}
