import React from 'react';
import { StyleSheet, Text, ScrollView, View, Dimensions, TouchableOpacity } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import moment from 'moment';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

const {height, width} = Dimensions.get('window');

export default class App extends React.Component {
  state = {
    currentView: 1,
    selectedDate: moment().format('YYYY-MM-DD'),
    agendaLst: {
      "2018-05-21": [{
          "time": "09:01",
          "agendaId": "1523416314746",
          "title": "Test",
          "dateTimeStart": "2018-05-21 09:01",
          "dateTimeEnd": "2018-05-21 13:01",
      }, {
          "time": "12:01",
          "agendaId": "1523415699355",
          "title": "Test 001",
          "dateTimeStart": "2018-05-21 12:01",
          "dateTimeEnd": "2018-05-21 13:01",
      }],
      "2018-05-22": [{
          "time": "06:50",
          "agendaId": "1523541034641",
          "title": "Test 111",
          "dateTimeStart": "2018-05-22 06:50",
          "dateTimeEnd": "2018-05-22 08:50",
      }, {
          "time": "08:50",
          "agendaId": "1523541039631",
          "title": "Test 2222",
          "dateTimeStart": "2018-05-22 08:50",
          "dateTimeEnd": "2018-05-22 23:50",
      }, {
          "time": "22:50",
          "agendaId": "1523541047254",
          "title": "Test 3333",
          "dateTimeStart": "2018-05-22 22:50",
          "dateTimeEnd": "2018-05-22 23:50",
      }]
    },
    items: {"2018-05-21": []},
  };

  componentDidMount() {
    this.onDayPress({ dateString: moment().format('YYYY-MM-DD') });
  }
  
  onDayPress = (day) => {
    this.setState({
      selected: day.dateString
    });
  }

  dayComponent = ({date, state}) => {
    const { dateString } = date;
    const key = Object.keys(this.state.agendaLst).find(key => dateString === key);

    const agendas = this.state.agendaLst[key];
    const dayHeight = height - 200;

    return (<View style={{flex: 1, borderBottomWidth: 1, borderColor:'#f2f2f2', height:dayHeight/5}}>
    <Text style={{textAlign: 'left', color: state === 'disabled' ? 'gray' : 'black'}}>{date.day}</Text>
      {agendas && 
        agendas.map(agenda => (
        <View key={agenda.agendaId} style={{backgroundColor:'#6B6B6B', width:'100%', borderRadius:4,
        borderWidth: 1,
        borderColor: '#fff', paddingTop:0, paddingBottom:0, paddingLeft: 10, paddingRight: 10}}>
        <Text style={{color:'#fff'}}>{agenda.title}</Text>
        </View>
        ))
      }
    </View>);
  }

  renderItem = (item) => {
    return (
        <View style={{backgroundColor:'#4E7D86',borderRadius:2, margin:2, padding:2}}>
            <TouchableOpacity style={{flex: 1}}>
                <Text style={{color: 'orange', fontWeight:'700',paddingLeft: 15}}>{moment(item.dateTimeStart).format('HH:mm')}</Text>
                <Text style={{paddingLeft: 15, marginTop: 10, color: '#fff', fontWeight:'700'}}>{item.title}</Text>
            </TouchableOpacity>
        </View>
    );
  }

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}></View>
    );
  }

  rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  }

  timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  onDayPress = (day) => {
    const { dateString } = day;
    const key = Object.keys(this.state.agendaLst).find(key => dateString === key);

    const agendas = this.state.agendaLst[key];

    const items = {[dateString]: {}};
    if(agendas && agendas.length > 0) {
      items[dateString] = agendas;
    }

    this.setState({
      selectedDate: dateString,
      items
    });
  }


  changeView = (selectedIndex) => {
    this.setState({currentView: selectedIndex })
  }
  render() {
    const { currentView, selectedDate } = this.state;
    const buttons = ['Month', 'Week', 'Day'];
    return (
      <ScrollView style={styles.container}>
      <View style={styles.text}>
        <ButtonGroup
        selectedIndex={currentView}
        buttons={buttons}
        onPress={this.changeView}
        containerStyle={{height: 30, width:500,alignItems: 'center'}}
        containerBorderRadius={3}
        selectedButtonStyle={{backgroundColor:'#000', }}
        selectedTextStyle={{color:'#fff'}}
      />
      </View>
        {currentView == 0 && <Calendar
          current={selectedDate}
          onDayPress={this.onDayPress}
          style={styles.calendar}
          dayComponent={this.dayComponent}
          pastScrollRange={24}
          futureScrollRange={24}
          horizontal
          pagingEnabled
          theme={{
            arrowColor: '#000',
            'stylesheet.calendar.header': {
              week: {
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'space-between'
              }
            }
          }}
        />
        }
        {currentView == 1 && <Agenda
          onDayPress={this.onDayPress}
            items={this.state.items}
            current={selectedDate}
            renderItem={this.renderItem}
            renderEmptyDate={this.renderEmptyDate}
            rowHasChanged={this.rowHasChanged}
            style={{height:height-70}}
            hideKnob={true}
          />
        }
        {currentView == 2 && <Agenda
            items={this.state.items}
            loadItemsForMonth={this.loadItems}
            current={selectedDate}
            renderItem={this.renderItem}
            renderEmptyDate={this.renderEmptyDate}
            rowHasChanged={this.rowHasChanged}
          />
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: height-50,

  },
  text: {
    alignItems:'center',
    borderColor: '#bbb',
    paddingTop:20,
    padding: 10,
    backgroundColor: '#eee'
  },
  container: {
    flex: 1,
    backgroundColor: 'gray'
  }
});
