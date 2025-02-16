import React,{Component} from 'react';
import {StyleSheet, View} from 'react-native';

import {
  Container,
  Content,
  Icon,
  Card,
  Text,
  H1,
  Thumbnail,
  Drawer,
} from 'native-base';

import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import FooterToolbar from '../../components/Footer';
import ContractorHeader from '../../components/ContractorHeader';
import ResumeCard from '../../components/ResumeCard';
import CertificateRow from '../../components/CertificateRow';
import AntiDoppingRow from '../../components/AntiDoppingRow';

import server from '../../libraries/server';

import AsyncStorage from '@react-native-community/async-storage';


const CertificateList = (props)=> {
  console.log("CERTIFICATE",props.certificateList)
  const lista = props.certificateList;
  const certificateList = lista.map((item,index)=>(
    <CertificateRow item={item} key={index} />
    )
  )
  return certificateList
}

const AntiDoppingList = (props)=> {
  console.log("CERTIFICATE",props.certificateList)
  const lista = props.certificateList;
  const certificateList = lista.map((item,index)=>(
    <AntiDoppingRow item={item} key={index} />
    )
  )
  return certificateList
}


export default class ContractorCertificates extends Component {

  constructor(props){
    super(props);

    this.state={
      api_url:null,
      token:null,
      modalVisible:false,
      email_seguridad:null,
      profile:null,
      profileContractor:{
        apellido_materno: "Uno",
        apellido_paterno: "Uno",
        celular: "4431236875",
        email: "contratista_1@sample.com",
        empresa_contratista: "EMPRESA1",
        image_avatar: "image_avatar_6bNT_m.jpg",
        image_profile: "image_profile_6bNT_m.jpg",
        nombre: "Contratista",
        ocupacion_cno: "Procesos industriales",
        puesto: "Soldador"
      },
      cursos_habilidades_laborales:[],
      antidopings:[],
      cursos_seguridad_interna:[]
    }

}


  async componentDidMount(){
    console.log("Entre a CONTRACTOR",this.props.navigation.state.params);
    // var TokenJWT = await server.login();
    // console.log("Descargardo Datos",TokenJWT,this.props.codeQr)
    var TokenJWT = await AsyncStorage.getItem('AUTH_TOKEN');
    const api_url = await AsyncStorage.getItem('API_URL')
    this.setState({api_url:api_url,token:TokenJWT})
    const email_seguridad = await AsyncStorage.getItem('ACCOUNT_ID')
    this.setState({email_seguridad:email_seguridad})
    console.log("Descargardo Datos",TokenJWT,"API",api_url)

    const certificateContractorData = await server.getContratistaTimeline(TokenJWT,this.props.navigation.state.params.emailContractor);
    console.log(certificateContractorData);

    this.setState({
      antidopings:certificateContractorData.antidopings,
      cursos_seguridad_interna:certificateContractorData.cursos_seguridad_interna,
      cursos_habilidades_laborales:certificateContractorData.cursos_habilidades_laborales
    })
}


  render(){
        return (
          <Drawer content={<Sidebar />}>
            <Container>
              <Header title="CertiFast" />
              <Content style={styles.main}>
                <ContractorHeader profile={this.state.profileContractor} api_url={this.state.api_url} />
                <View style={styles.cardscontainer}>
                  <Card style={styles.card}>
                    <CertificateList certificateList={this.state.cursos_habilidades_laborales}/>
                    <AntiDoppingList certificateList={this.state.antidopings}/>
                  </Card>
                </View>
              </Content>
              <FooterToolbar
                navegacion={this.props.navigation}
                currentKey={this.props.navigation.state.params.keyValue}
                profile={this.state.profile}
              />
            </Container>
          </Drawer>
        );
  }

  addKeys= (lista)=>{
    let newList = []
    lista.forEach(function(item,index){
        item.key = `${index}`;
        newList.push(item);
    })
    console.log(newList)
    return newList
  }
}

//
const styles = StyleSheet.create({
  main: {
    backgroundColor: '#FCFCFC',
  },
  cardscontainer: {
    padding: 15,
    marginTop: -100,
  },
  card: {
    borderRadius: 10,
    shadowOffset: {
      height: 3,
      width: 0,
    },
    shadowColor: 'rgba(0,0,0,1)',
    shadowOpacity: 0.06,
    overflow: 'hidden',
  },
});
