import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import './App.css';
import { List, Avatar} from 'antd';
import Nav from './Nav'
import { connect } from 'react-redux';

function ScreenSource(props) {

  const [sourceList, setSourceList] = useState([])
  const [selectedLang, setSelectedLang] = useState(props.selectedLang)

/*INITIALISATION APP IMPORT WISHLIST */
  useEffect(() => {
    var token = props.token
    const getBddArticles = async() => {
      const articles = await fetch(`/import-bdd/${token}`)
    }

    getBddArticles()    
  }, [])


/*GESTION LANGUE */
  useEffect(() => {
    const APIResultsLoading = async() => {
      var langue = 'fr'
      var country = 'fr'
        
      if(selectedLang == 'en'){
        var langue = 'en'
        var country = 'us'
        
      }
      props.changeLang(selectedLang)
      const data = await fetch(`https://newsapi.org/v2/sources?language=${langue}&country=${country}&apiKey=0743bd9ba86c48a3b4a615993d6b387a`)
      const body = await data.json()
      setSourceList(body.sources)
      
      //Sauvegarde de la langue lors du click
      var reponse = await fetch('/update-language', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `token=${props.token}&language=${selectedLang}`
      })

    }

    APIResultsLoading()
  }, [selectedLang])

  var borderEn = {width:'40px', margin:'10px',cursor:'pointer'}
  if (selectedLang=='en'){
    borderEn = {width:'40px', margin:'10px',cursor:'pointer', border: '2px solid red'}
  }

  var borderFr = {width:'40px', margin:'10px',cursor:'pointer'}
  if (selectedLang=='fr'){
    borderFr = {width:'40px', margin:'10px',cursor:'pointer', border: '2px solid red'}
  }


  return (
    <div>
        <Nav/>
       
       <div style={{display:'flex', justifyContent:'center', alignItems:'center'}} className="Banner">
          <img style={borderFr} src='/images/fr.png' onClick={() => setSelectedLang('fr')} />
          <img style={borderEn} src='/images/uk.png' onClick={() => setSelectedLang('en')} /> 
        </div>

       <div className="HomeThemes">
          
              <List
                  itemLayout="horizontal"
                  dataSource={sourceList}
                  renderItem={source => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={`/images/${source.category}.png`} />}
                        title={<Link to={`/screenarticlesbysource/${source.id}`}>{source.name}</Link>}
                        description={source.description}
                      />
                    </List.Item>
                  )}
                />


          </div>
                 
      </div>
  );
}

function mapStateToProps(state){
  return   {selectedLang: state.selectedLang,  token: state.token}
                  
}

function mapDispatchToProps(dispatch){
  return {
    changeLang: function(selectedLang){
      dispatch({type: 'changeLang', selectedLang: selectedLang})
    },
    addToWishList: function(article){
      dispatch({type: 'addArticle',
        articleLiked: article
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenSource)
