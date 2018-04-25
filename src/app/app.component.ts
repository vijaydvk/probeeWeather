import { Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 constructor(){}
  data = [];
  result_from_db = [];
  //Jquery bind after all dom initialize
  ngAfterViewChecked() {
    let self=this;
		$("#submit").off().on('click', function() { 
			$.when(self.weatherApiCall()).then(function() {
			  //JSON_data = this.data;
			  //console.log(this.data); 
			  $('#city_name_disp').html("City of "+this.data.name);
			  $('#city_temp').html("Temp : "+this.data.main["temp"]+"&#8451;");
			  $('#city_cloudiness').html("Cloudiness : "+this.data.weather[0]["description"]);
			  $('#city_pressure').html("Pressure : "+this.data.main["pressure"]+"hpa");
			  var sun_rise = new Date(this.data.sys["sunrise"]*1000)
			  var sun_set =  new Date(this.data.sys["sunset"]*1000)
			   var nsun_rise =  sun_rise.toLocaleTimeString();
			   var nsun_set = sun_set.toLocaleTimeString();
			  var insert_obj = {};
			  $('#city_sunrise').html("Sun rise : "+nsun_rise);
			  $('#city_sunset').html("sun set : "+nsun_set);
			  insert_obj["city"] = this.data.name;
			  insert_obj["temp"] = this.data.main["temp"];
			  insert_obj["cloud"] = this.data.weather[0]["description"];
			  insert_obj["pressure"] = this.data.main["pressure"];
			  insert_obj["sunrise"] = this.data.sys["sunrise"]
			  insert_obj["sunset"] = this.data.sys["sunset"]
			  
			  $.when(self.checkLocationAvailable(this.data.name)).then(function() {
				if(this.result_from_db.length == 0)
				{
					$('#prev_city_name_disp').html("No Previous Result");
					$('#prev_city_temp').html("");
					$('#prev_city_cloudiness').html("");
					$('#prev_city_pressure').html("");
					$('#prev_city_sunrise').html("");
					$('#prev_city_sunset').html("");	
						$.ajax({
							url:'http://localhost/crud.php?action=saveWeather',         
							//url:'php/index_page_store_display.php',
							type:'POST',
							data: insert_obj,
							success:function(data){
									
							}
						});	
				}
				else
				{
					console.log(insert_obj["temp"]);
					console.log(this.result_from_db[0].city_temp);
					self.dispPrevWeather(this.result_from_db);
					if(insert_obj["temp"] != this.result_from_db[0].city_temp)
					{
						$.ajax({
							url:'http://localhost/crud.php?action=saveWeather',         
							//url:'php/index_page_store_display.php',
							type:'POST',
							data: insert_obj,
							success:function(data){
									
							}
						});	
					}
				}
			  });
			  
			});
		});
	}
	private weatherApiCall()
	{
		return $.ajax({
			url:'https://api.openweathermap.org/data/2.5/weather?q='+$('#city_name').val()+'&APPID=eb9ede1561b94cee58817996b8fca868&units=metric',         
			//url:'php/index_page_store_display.php',
			type:'POST',
			//data: "start=" + pagval,
			success:function(data){
				this.data = data;
				//console.log(this.data);
			}
		});

	}
	
	private checkLocationAvailable(city_name)
	{
		return $.ajax({
			url:'http://localhost/crud.php?action=getweather&city='+city_name,         
			//url:'php/index_page_store_display.php',
			type:'POST',
			//data: "start=" + pagval,
			success:function(data){
				//console.log(data);
				this.result_from_db = $.parseJSON(data);
				//console.log(this.result_from_db.length);
				
			}
		});		
	}
	
	private dispPrevWeather(prev_data)
	{
		$('#prev_city_name_disp').html("City of "+prev_data[0].city_name);
		$('#prev_city_temp').html("Temp : "+prev_data[0].city_temp+"&#8451;");
		$('#prev_city_cloudiness').html("Cloudiness : "+prev_data[0].city_cloudiness);
		$('#prev_city_pressure').html("Pressure : "+prev_data[0].city_pressure+"hpa");

		var sun_rise = new Date(prev_data[0].city_sunrise*1000)
		var sun_set =  new Date(prev_data[0].city_sunset*1000)
		var nsun_rise =  sun_rise.toLocaleTimeString();
		var nsun_set = sun_set.toLocaleTimeString();
		
		$('#prev_city_sunrise').html("Sun rise : "+nsun_rise);
		$('#prev_city_sunset').html("sun set : "+nsun_set);		
	}	

	

}
