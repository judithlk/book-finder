import React, { useState } from "react";
import axios from 'axios';
import { Card } from "react-bootstrap";
import './bookfinder.css';
import { Search } from "react-bootstrap-icons";
//import { responsivePropType } from "react-bootstrap/esm/createUtilityClasses";

function BookFinder() {
    const [inputTerm, setInputTerm] = useState('');
    const [result, setResult] = useState([]);
    let authorsNames = "";
    const changeHandler = (e) => {
        setInputTerm(e.target.value);
    }
    const authorsConcat = x => {
        if(x.length <= 2) {
            authorsNames = x.join(" & ");
        }else if(x.length > 2) {
            let lastName = ' & ' + x.slice(-1);
            x.pop();
            authorsNames = x.join(", ");
            authorsNames += lastName;
        }
        return authorsNames;
    } 

    const submitHandler = (e) => {
        e.preventDefault();
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${inputTerm}&key=${process.env.REACT_APP_GB_API_KEY}&maxResults=40`)
        
        .then(response => {
            console.log(response.data.items);
            setResult(response.data.items);
        })
        .catch(err => {
            console.log(err);
        })
    }
    
    return (
        <div className="wrapper">
            <form onSubmit={submitHandler} className="form-box d-flex justify-content-evenly">
                <input type="text" placeholder="Enter book title..." onChange={changeHandler}/>
                <button type="submit" className="search-button ms-3">
                    <Search />
                </button>
            </form>

            <div className="container">
                <div className="row result-box">
                    {result.map(inputTerm => (
                        <div key={inputTerm.id} className="col-sm-3 card-box">
                            <Card style={{ 'marginTop': '10px'}}>
                                <Card.Img variant="top" src={inputTerm.volumeInfo.imageLinks !== undefined ? inputTerm.volumeInfo.imageLinks.thumbnail : ''} alt={inputTerm.volumeInfo.title + " cover"} />
                                <Card.Body>
                                    <h5 className="card-title title-display">{inputTerm.volumeInfo.title}</h5>
                                    {/* <small>{authorsConcat(inputTerm.volumeInfo.authors)}</small> */}
                                    <a href={inputTerm.volumeInfo.canonicalVolumeLink} target="_blank" rel="noreferrer" className="btn primary-btn">Know More</a>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BookFinder;