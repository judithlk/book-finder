import React, { useState } from "react";
import axios from 'axios';
import './bookfinder.css';
import { Search } from "react-bootstrap-icons";
// import xtype from 'xtypejs';
//import { responsivePropType } from "react-bootstrap/esm/createUtilityClasses";

function BookFinder() {
    const [inputTerm, setInputTerm] = useState('');
    const [result, setResult] = useState([]);
    const footerDate = new Date().getFullYear();
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

    window.addEventListener('scroll', () => {
        if(window.scrollY > 1) {
            document.getElementById('site-header').style.backgroundColor = "darkslategray";
            document.getElementById('site-header').style.opacity = "0.8";
            document.getElementById('site-header').style.color = "white";
        }else{
            document.getElementById('site-header').style.backgroundColor = "transparent";
            document.getElementById('site-header').style.opacity = "1";
            document.getElementById('site-header').style.color = "black";
        }
    })
    const submitHandler = (e) => {
        e.preventDefault();
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${inputTerm}&key=${process.env.REACT_APP_GB_API_KEY}&maxResults=40`)
        
        .then(response => {
            setResult(response.data.items);
            let resLength = response.data.items.length;
            document.getElementById('showing-result').innerHTML = 'Showing results for "' + inputTerm + '" (' + resLength + ' results)';
        })
        .catch(err => {
            console.log(err);
        })
    }
    
    return (
        <div className="wrapper">
            <div id="site-header" className="site-header">
                <h2>T H E   B O O K   F I N D E R</h2>
            </div>
            <form onSubmit={submitHandler} className="form-box">
                <input type="text" placeholder="Enter book title..." onChange={changeHandler}/>
                <button type="submit" className="search-button">
                    <Search />
                </button>
            </form>

            <div className="container">
                <p id="showing-result" className="showing-result"></p>
                <div className="row result-box">
                    {result.map(inputTerm => (
                        <div key={inputTerm.id} className="col-sm-4 col-lg-2 card-box">
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
            <footer className="site-footer">
                <a href="https://github.com/judithlk" target="_blank" rel="noreferrer">Judith Yusuf</a>, <span>{footerDate}</span>
            </footer>
        </div>
    )
}

export default BookFinder;