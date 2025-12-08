const Notification = ({ message, themeColor } ) => {
    if (!message) return null;

    const ntStyle = {
        color: themeColor,
        backgroundColor: 'lightgrey',
        border: `2px solid ${themeColor}`,
        borderRadius: '5px',
        marginBottom: '10px',
        height: '40px',
        paddingLeft: '10px',
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center'
    }
    return (
        <div style={ntStyle}>
            <p>{message}</p>
        </div>
    )
}

export default Notification
