export function Inventory({ inventory }) {
    const images = inventory.items.map(item => 
        <img 
            className="item-icon" 
            key={item.hash} 
            alt={item.displayProperties.name} 
            src={`https://bungie.net${item.displayProperties.icon}`}
         />
    );

    return (
        <div className="inventory-container tile">
            <p className="inventory-label">{inventory.label}</p>
            {images.length > 0 ? images : <i>No items!</i>}
        </div>
    );
}