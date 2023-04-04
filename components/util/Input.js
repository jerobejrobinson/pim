export default function Input({id, label, textarea}) {
    
    return (
        <div style={{display: 'flex', flexDirection: "column", border: '1px solid black', padding: "1rem", position: 'relative', margin: '1.5rem 0 1.5rem 0',  background: "#f9f9f9"}}>
            <label htmlFor={id} style={{position: 'absolute', top: 0, transform: 'translateY(-50%)', background: "#ffffff", padding: '.5rem', border: '1px solid black'}}>{label}</label>
            {textarea ? <textarea id={id} style={{margin: '.5rem 0 .5rem 0', resize: 'vertical'}}></textarea> : <input type="text" name={id} id={id} style={{margin: '.5rem 0 .5rem 0'}}/>}
        </div>
    )
}