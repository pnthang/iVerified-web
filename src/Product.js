import React, { useState } from 'react';

export default function Product(){
    const [sku, setSku] = useState('');
    const [name, setName] = useState('');
    const [productSubCategoryId, setProductSubCategoryId] = useState('');
    const [producerId, setProducerId] = useState('');
    const [cityId, setCityId] = useState('');
    const [shortDescription, setShortDescription] = useState('');    
    const [fetchCity, setFetchCity] = useState(undefined);
    const [fetchCategory, setFetchCategory] = useState(undefined);
    const [fetchProducer, setFetchProducer] = useState(undefined);
    
    useEffect(() => {
        fetchData();
    }, [])

    function fetchData() {
        fetch('http://localhost:8888/cities')
            .then(response => response.json())
            .then(json => setFetchCity(json));
    }

    


    const onChange = sku => event => {
        switch (sku) {
            case "sku":
                setSku(event.target.value);
                break;
            case "name":
                setName(event.target.value);
                break;
            case "productSubCategoryId":
                setProductSubCategoryId(event.target.value);
                break;
            case "producerId":
                setProducerId(event.target.value);
                break;
            case "cityId":
                setCityId(event.target.value);                
                break;
            case "shortDescription":
                setShortDescription(event.target.value);
                break;
            default :
                break;            
        }
    }    

    function onSubmit(e){
        e.preventDefault();
        let data= {
            sku,
            name,
            producerId,
            productSubCategoryId,
            cityId,
            shortDescription
        }        
        fetch('http://localhost:8888/products', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json'
                }
        }).then(function(response) {
                return response.json();
        }).then(function(data) {
            console.log('Created product:', data);
        });
    }

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label>SKU</label>
                <input type="text" value={sku} onChange={onChange("sku")} />
            </div>
            <div>
                <label>Name</label>
                <input type="text" value={name} onChange={onChange("name")} />
            </div>
            <div>
                <label>Product Category</label>
                <input type="text" value={productSubCategoryId} onChange={onChange("productSubCategoryId")} />
            </div>
            <div>
                <label>Producer</label>
                <input type="text" value={producerId} onChange={onChange("producerId")} />
            </div>
            <div>
                <label>City ID</label>
                <input type="text" value={cityId} onChange={onChange("cityId")} />
            </div>
            <div>
                <label>Description</label>
                <input type="text" value={shortDescription} onChange={onChange("shortDescription")} />
            </div>
            <input type="submit" value="Submit" />
        </form>
    );
}