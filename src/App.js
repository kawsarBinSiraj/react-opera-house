import React, { Component } from 'react'
import Axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';
import { SRLWrapper } from "simple-react-lightbox";
import Pagination from "react-js-pagination";
import './App.scss'
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from "react-promise-tracker";
import BeatLoader from "react-spinners/BeatLoader";
import logo from './logo.svg';


export const LoadingSpinerComponent = (props) => {
    const { promiseInProgress } = usePromiseTracker();
    return (
        <div className="d-flex justify-content-center">
            { (promiseInProgress === true) ? <BeatLoader size={20} /> : null}
        </div>
    )
};


const category = [
    { value: 'fashion', label: 'Fashion' },
    { value: 'nature', label: 'Nature' },
    { value: 'science', label: 'Science' },
    { value: 'education', label: 'Education' },
    { value: 'feelings', label: 'Feelings' },
    { value: 'health', label: 'Health' },
    { value: 'people', label: 'People' },
    { value: 'religion', label: 'Religion' },
    { value: 'sports', label: 'Sports' },
    { value: 'food', label: 'Food' },
    { value: 'music', label: 'Music' },
];

const type = [
    { value: 'photo', label: 'Photo' },
    { value: 'vector', label: 'Vector' },
    { value: 'illustration', label: 'Illustration' },
];


class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activePage: 1,
            per_page: 12,
            searchKey: '',
            selectType: 'all',
            selectCategory: 'backgrounds',
            totalHits: 0,
            operaData: []
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }


    async loadData() {
        let { searchKey, activePage, per_page, selectType, selectCategory } = this.state;
        let API = `https://pixabay.com/api/?key=20896420-a6a5c8471f498bed7fac9bfaa&q=${searchKey}&image_type=${selectType}&page=${activePage}&per_page=${per_page}&category=${selectCategory}`
        await trackPromise(
            // Make a request for a user with a given ID
            Axios.get(API)
                .then(response => {
                    console.log(response);
                    // handle success
                    response.data.hits.length && this.setState({
                        operaData: response.data.hits,
                        totalHits: response.data.totalHits
                    });
                })
                .catch(error => {
                    // handle error
                    toast.error(error.toString(), {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                    console.log(error);
                })
        )
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.searchKey.toString().length < 1 && this.state.selectType === 'all' && this.state.selectCategory === 'backgrounds') {
            // handle error
            toast.info('Data auto loaded by the search of default API request', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
        this.loadData()
    }

    handleChange(event) {
        this.setState({
            searchKey: event.target.value
        });
    }

    handlePageChange(pageNumber) {
        this.setState({ activePage: pageNumber }, () => {
            this.loadData();
        });
    }

    handleSelectChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    componentDidMount() {
        this.loadData();
    }

    componentWillUnmount() {
        toast.dismiss();
    }

    render() {
        return (
            <>
                <section className='opera-house py-5'>
                    <div className="container">
                        <div className="section-header text-center mb-3">
                            <img src={logo} className="App-logo mb-1" alt="logo" />
                            <h2 className={'display-3'}>Opera House</h2>
                            <p className="fs-4">
                                Images are appearing from
                                <a target={'_blank'} href={'https://pixabay.com/'} className={'text-primary'} rel="noreferrer"> pixabay.com</a> by the request of API
                            </p>
                        </div>
                        <div className="row mt-5">
                            <div className="col-xl-8 offset-xl-2">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <div className="row align-items-center justify-content-center">
                                            <div className="col-xl-6">
                                                <input type="search" className="form-control rounded-pill ps-4 mt-4" value={this.state.searchKey} placeholder={'write here...'} onChange={this.handleChange} />
                                            </div>
                                            <div className="col-xl-5">
                                                <div className="select-box d-flex">
                                                    <div className="select-type w-100 mx-2">
                                                        <label htmlFor="#" className='mb-1'><small>Select Type</small></label>
                                                        <select name="selectType" className={'form-select'} onChange={(e) => { this.handleSelectChange(e) }}>
                                                            <option defaultValue='all'>All</option>
                                                            {
                                                                type.map((item, index) => {
                                                                    return (
                                                                        <option key={index} value={item.value}>{item.label}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className="select-category w-100 mx-2">
                                                        <label htmlFor="#" className='mb-1'><small>Select Category</small></label>
                                                        <select name="selectCategory" className={'form-select'} onChange={(e) => { this.handleSelectChange(e) }}>
                                                            <option defaultValue='backgrounds'>Backgrounds</option>
                                                            {
                                                                category.map((item, index) => {
                                                                    return (
                                                                        <option key={index} value={item.value}>{item.label}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-1">
                                                <button type="submit" className={'btn btn-submit btn-primary rounded-pill px-5 mt-4'}>Search</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <SRLWrapper>
                            <div className="row mt-5 position-relative">
                                <LoadingSpinerComponent />
                                {
                                    this.state.operaData.length ?
                                        this.state.operaData.map((item, index) => {
                                            return (
                                                <div className="col-xl-4 col-md-4 col-sm-6" key={item.id}>
                                                    <div className="opera-item d-flex align-items-center justify-content-center mb-4">
                                                        <a href={item.largeImageURL}>
                                                            <img src={item.largeImageURL} alt="" className={'img-fluid'} style={{ height: '300px', objectFit: 'cover', objectPosition: 'top' }} />
                                                        </a>
                                                    </div>
                                                </div>
                                            )
                                        })
                                        : null
                                }
                            </div>
                        </SRLWrapper>
                        <div className="pagination-wrapper mt-4 d-flex justify-content-center">
                            <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={12}
                                totalItemsCount={this.state.totalHits}
                                pageRangeDisplayed={10}
                                onChange={this.handlePageChange.bind(this)}
                            />
                        </div>
                    </div>
                </section>
                <ToastContainer />
            </>
        )
    }
}

export default App