import React, { useState } from "react";
import axios from 'axios';
import './bookfinder.css';
import { Search } from "react-bootstrap-icons";
// import xtype from 'xtypejs';
//import { responsivePropType } from "react-bootstrap/esm/createUtilityClasses";

function BookFinder() {
    const [inputTerm, setInputTerm] = useState('');
    const [result, setResult] = useState([]);
    let authorsNames = "";
    const changeHandler = (e) => {
        setInputTerm(e.target.value);
    }
    const authorsConcat = (x) => {
        if(x !== undefined){
            if(x.length <= 2) {
                authorsNames = x.join(" & ");
            }else if(x.length > 2) {
                let lastName = ' & ' + x.slice(-1);
                x.pop();
                authorsNames = x.join(", ");
                authorsNames += lastName;
            }
        }else{
            authorsNames = "Author unavailable";
        }
        return authorsNames;
    } 

    const submitHandler = (e) => {
        e.preventDefault();
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${inputTerm}&key=${process.env.REACT_APP_GB_API_KEY}&maxResults=20`)
        
        .then(response => {
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
                        <div key={inputTerm.id} className="col-sm-4 col-lg-3 card-box">
                            <div className="image-display">
                                <img src={inputTerm.volumeInfo.imageLinks !== undefined ? inputTerm.volumeInfo.imageLinks.thumbnail : ''} alt={inputTerm.volumeInfo.title + " cover"}/>
                            </div>
                            <div className="info-display">
                                <h5 className="title-display">{inputTerm.volumeInfo.title}</h5>
                                <h6 className="author-display">{authorsConcat(inputTerm.volumeInfo.authors)}</h6>
                            </div>
                                <a href={inputTerm.volumeInfo.canonicalVolumeLink} target="_blank" rel="noreferrer" className="link-button"><button>Know More</button></a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BookFinder;