import React,{Component} from 'react';
import {StyleSheet} from 'react-native';


import {
  Container,
  Content,
  Item,
  Input,
  Icon,
  Card,
  Button,
  Text,
} from 'native-base';

import AsyncStorage from '@react-native-community/async-storage';
import server from '../../libraries/server';


export default class Login extends Component{

  constructor(props){
    super(props)
    this.state={
      email:'',
      emailError:false,
      password:'',
      passwordError:false,
      response:''
    }
    this.login = this.login.bind(this);

  }


  login = async function(){
   console.log("Entre al login action");

    const {email, password, response } = this.state;

   if (email.length === 0) {
     return this.setState({
       emailError: true
     });
   }

   this.setState({
     emailError: false
   });

   if (password.length === 0) {
     return this.setState({
       passwordError: true
     });
   }

   this.setState({
     passwordError: false
   });


   try {
     console.log("Consulto Token")
     console.log(this.state.email,this.state.password)
     if(this.state.email == "seguridad_1@sample.com"){
       var TokenJWT = await server.createSession({username:'bc',password:this.state.password});
     }else{
       var TokenJWT = await server.createSession({username:this.state.email,password:this.state.password});
     }

     console.log("JWT",TokenJWT)

     if(TokenJWT){

       this.setState({ response: TokenJWT })

       var profile = await server.getSecurityProfile(TokenJWT,this.state.email);
       console.log(profile)
       await AsyncStorage.setItem('AUTH_TOKEN',TokenJWT);
       await AsyncStorage.setItem('ACCOUNT_ID', this.state.email);
       await AsyncStorage.setItem('ACCOUNT', JSON.stringify(profile));
       this.props.navigation.navigate('App',{profile:profile});

     }

     // .then((data)=>{
     //   console.log(data)
     // })
     // .catch(error=>{
     //   console.log(error)
     // })

   }
   catch(error){
     console.log(error)
     this.setState({response:error.toString()})
   }


 }

  validate = (text) => {
         console.log(text);
           let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
           if(reg.test(text) === false)
           {
             alert("Email is Not Correct");
             this.setState({email:text})
             return false;
           }
           else {
             this.setState({email:text})
             alert("Email is Correct");
           }
       }


  render(){
    //console.log(this.props);

    return (
      <Container style={styles.main}>
        <Container style={styles.roundbackground}>
          <Text style={styles.roundbackground__text}>CertiFast</Text>
        </Container>
        <Content style={styles.maincontent}>
          <Card style={styles.card}>
            <Item style={styles.card__item}>
              <Icon active type="Feather" name="user" />
              <Input
              placeholder="Username"
              onChangeText={(email)=>{
                  this.setState({email:email})
                  }}
              autoCapitalize="none"

              />
            </Item>
            <Item style={styles.card__item}>
              <Icon type="Feather" active name="lock" />
              <Input placeholder="Password"
              secureTextEntry={true}
              onChangeText={(password)=>this.setState({password})}
              autoCapitalize="none"

               />
            </Item>
            <Button
              rounded
              block
              style={styles.card__button}
              onPress={this.login}>
              <Text>Login</Text>
            </Button>
          </Card>
          <Text style={styles.cardRoute}>www.certifastind.com</Text>
        </Content>
      </Container>
    );
  }
}

//Line 147 () => history.push('/companies')

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#FCFCFC',
    position: 'relative',
  },
  roundbackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 300,
    backgroundColor: '#000',
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 100,
    zIndex: 2,
  },
  roundbackground__text: {
    marginTop: 50,
    width: '100%',
    textAlign: 'center',
    color: '#fff',
    fontSize: 32,
  },
  maincontent: {
    padding: 30,
    position: 'absolute',
    top: 100,
    left: 0,
    zIndex: 3,
    width: '100%',
  },
  card: {
    width: '100%',
    paddingVertical: 30,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowOffset: {
      height: 3,
      width: 0,
    },
    shadowColor: 'rgba(0,0,0,1)',
    shadowOpacity: 0.06,
  },
  card__item: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
    shadowOffset: {
      height: 3,
      width: 0,
    },
    shadowColor: 'rgba(0,0,0,1)',
    shadowOpacity: 0.06,
  },
  card__button: {
    marginTop: 30,
    backgroundColor: '#D10000',
  },
  cardRoute: {
    width: '100%',
    textAlign: 'right',
    color: '#D10000',
    marginTop: 5,
  },
});
