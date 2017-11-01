precision highp float;

varying vec4 position;

uniform float windowWidth;
uniform float windowHeight;
uniform float frameNum;

void main(void) 
{
	float x = gl_FragCoord[0];
	float y = gl_FragCoord[1];
	gl_FragColor = vec4(0.78-(sin(frameNum*0.003)+0.85),0.9,1.0,1.0);
	
	// Sun and Moon
	float b = mod((frameNum/1000.0), 4.0);
	float ur = 20.0;
	if(b > 2.0 ){
		float moonX = x-windowWidth*0.5 + cos(frameNum*0.05)*0.8 - 1500.0 + b*500.0;
		float moon2X = x-windowWidth*0.5 + cos(frameNum*0.05)*0.8 - 12.5 - 1500.0 + b*500.0;
		float moonY = y-windowHeight*0.5 + sin(frameNum*0.05)*2.0 - 220.0;
		if(((moonX*moonX)/(1.8)) + ((moonY*moonY)/(1.8)) < ur*ur) gl_FragColor = vec4(0.85+abs(0.5-(cos(frameNum*0.035)*0.095)),0.75+abs(0.5-(cos(frameNum*0.035)*0.095)),0.6,1.0);
		if(((moon2X*moon2X)+180.0/(1.8)) + ((moonY*moonY)/(1.0)) < ur*ur) gl_FragColor = vec4(0.78-(sin(frameNum*0.003)+0.85),0.9,1.0,1.0);
	}
	if(b > 0.0 && b < 2.0){
		float sunX = x-windowWidth*0.5 + cos(frameNum*0.05)*0.8 - 500.0 + b*500.0;
		float sunY = y-windowHeight*0.5 + sin(frameNum*0.05)*3.0 - 220.0;
		if(((sunX*sunX)/(1.8)) + ((sunY*sunY)/(1.8)) < ur*ur) gl_FragColor = vec4(1.0,0.87,0.0,1.0);
	}
	
	// UFO
	float ufoX = x-windowWidth*0.5 + cos(frameNum*0.05)*0.8 - 600.0 + frameNum*0.3;
	float ufoY = y-windowHeight*0.5 + sin(frameNum*0.05)*3.0 - 130.0;
	if(((ufoX*ufoX)/(0.4)) + ((ufoY*ufoY)/(0.175)) < ur*ur) gl_FragColor = vec4(0.45+(cos(frameNum*0.035)*0.095),0.5,0.9,1.0);
	if(((ufoX*ufoX)/(2.25)) + ((ufoY*ufoY)/(0.05)) < ur*ur) gl_FragColor = vec4(0.6,0.6+(sin(frameNum*0.035)*0.085),0.9,1.0);
	
	//if(((ufoX*ufoX)/(0.8)) + ((ufoY*ufoY)/(0.35)) < ur*ur) gl_FragColor = vec4(0.45+(cos(frameNum*0.035)*0.095),0.5,0.9,1.0);
	//if(((ufoX*ufoX)/(4.5)) + ((ufoY*ufoY)/(0.1)) < ur*ur) gl_FragColor = vec4(0.6,0.6+(sin(frameNum*0.035)*0.085),0.9,1.0);
	
	// Mountains
	float r = 100.0;
	float circX = x-windowWidth*0.5 - 10.0 + frameNum * 0.09;
	float circ2X = x-windowWidth*0.5 + 170.0 + frameNum * 0.06;
	float circ3X = x-windowWidth*0.5 + 400.0 + frameNum * 0.08;
	float circ4X = x-windowWidth*0.5 - 200.0 + frameNum * 0.05;
	float circ5X = x-windowWidth*0.5 - 400.0 + frameNum * 0.04;
	float circ6X = x-windowWidth*0.5 - 600.0 + frameNum * 0.03;
	float circY = y-windowHeight*0.5 + 120.0;
	if(((circ6X*circ6X)/(1.0)) + ((circY*circY)/(5.0)) < r*r) gl_FragColor = vec4(0.35,0.5,0.6,1.0);
	if(((circ5X*circ5X)/(3.0)) + ((circY*circY)/(2.0)) < r*r) gl_FragColor = vec4(0.3,0.4,0.6,1.0);
	//if(((circX*circX)/(1.5)) + ((circY*circY)/(4.0)) < r*r) gl_FragColor = vec4(0.4,0.5,0.7,1.0);
	if(((circ2X*circ2X)/(1.0)) + ((circY*circY)/(3.0)) < r*r) gl_FragColor = vec4(0.3,0.4,0.6,1.0);
	if(((circ3X*circ3X)/(2.0)) + ((circY*circY)/(2.5)) < r*r) gl_FragColor = vec4(0.4,0.5,0.8,1.0);
	if(((circ4X*circ4X)/(1.2)) + ((circY*circY)/(3.5)) < r*r) gl_FragColor = vec4(0.4,0.5,0.7,1.0);
	if(((circX*circX)/(1.5)) + ((circY*circY)/(4.0)) < r*r) gl_FragColor = vec4(0.4,0.5,0.8,1.0);
	
	// Top grass
	if(y + 5.0 < 5.0*sin(3000.1*x + frameNum*1.0) + (windowHeight*0.5 + 1.2*sin(frameNum*2.1)) - 50.0) gl_FragColor = vec4(0.1+(cos(frameNum*0.035)-0.85),0.8,0.6,1.0);	
	
	// ==============Road Sign===============
	float loopR = mod((frameNum/250.0), 2.0);
	if( loopR > 0.0){
	
		// Sign rod
		float sign1W = 6.0;
		float sign1H = 30.0;
		float sign1X = windowWidth*0.5 + 1400.0 - loopR*3325.0;
		float sign1Y = windowHeight*0.5 - 45.0;
	
		// Sign body
		float signX = x-windowWidth*0.5 - 1400.0 + loopR*3325.0;
		float signY = y-windowHeight*0.5 + 5.0 - cos(frameNum*0.05);
		float sr = 24.0;
		
		// Sign symbol
		float sign3W = 15.0;
		float sign3H = 5.0;
		float sign3X = windowWidth*0.5 + 1400.0 - loopR*3325.0;
		float sign3Y = windowHeight*0.5 - 5.0 + cos(frameNum*0.05);
		
		// Draw
		if(x > sign1X-sign1W && x < sign1X+sign1W && y > sign1Y-sign1H && y < sign1Y+sign1H) gl_FragColor = vec4(0.55,0.55,0.55,1.0);
		if(signX*signX + signY*signY < sr*sr) gl_FragColor = vec4(0.9,0.35,0.4,1.0);
		if(x > sign3X-sign3W && x < sign3X+sign3W && y > sign3Y-sign3H && y < sign3Y+sign3H) gl_FragColor = vec4(1.0,1.0,1.0,1.0);
	} 
	// ==============End Road Sign===============
	
	
	// ==============Road and Car===============
	// Road
	float roadW = 500.0;
	float roadH = 30.0;
	float roadX = windowWidth*0.5;
	float roadY = windowHeight*0.5 - 100.0 + sin(frameNum*0.025);
	if(x > roadX-roadW && x < roadX+roadW && y > roadY-roadH && y < roadY+roadH) gl_FragColor = vec4(0.4,0.4,0.4,1.0);
	
	// Road strips
	float theta = (frameNum+14.0) * 0.02;
	float roadsW = (sin(x*(sin(theta))))*900.0;
	float roadsH = abs(3.0);
	float roadsX = windowWidth*0.5;
	float roadsY = windowHeight*0.5 - 92.0 + sin(frameNum*0.025);
	if(x > roadsX-roadsW && x < roadsX+roadsW && y > roadsY-roadsH && y < roadsY+roadsH) gl_FragColor = vec4(1.0,1.0,1.0,1.0);
	
	// Car
	float initialCarPosition = 500.0;
	float car1W = 38.0;
	float car1H = 10.0;
	float car1X = windowWidth*0.5 + sin(frameNum * 0.05) * 20.0 - 200.0 - initialCarPosition;
	float car1Y = windowHeight*0.5 + cos(frameNum * 0.05) - 100.0;
	
	float car2W = 25.0;
	float car2H = 8.0;
	float car2X = windowWidth*0.5 + sin(frameNum * 0.05) * 20.0 - 200.0 - initialCarPosition;
	float car2Y = windowHeight*0.5+13.0 + cos(frameNum * 0.05) - 100.0;
	
	float car3W = 6.5;
	float car3H = 5.0;
	float car3X = windowWidth*0.5 + 10.0 + sin(frameNum * 0.05) * 20.0 - 200.0 - initialCarPosition;
	float car3Y = windowHeight*0.5 + 13.0 + cos(frameNum * 0.05) - 100.0;
	
	float tyre1X = x-windowWidth*0.5 + 20.0 - sin(frameNum * 0.05) * 20.0 + 200.0 + initialCarPosition;
	float tyre1Y = y-windowHeight*0.5 + 3.0 - cos(frameNum * 0.05) + 107.0;
	float tyre2X = x-windowWidth*0.5 - 20.0 - sin(frameNum * 0.05) * 20.0 + 200.0 + initialCarPosition;
	float tyre2Y = y-windowHeight*0.5 + 3.0 - cos(frameNum * 0.05) + 107.0;
	float tr = 10.0;
	
	if(frameNum < 600.0){
		car1X += frameNum;
		car2X += frameNum;
		car3X += frameNum;
		tyre1X -= frameNum;
		tyre2X -= frameNum;
	}
	else{
		car1X += 600.0;
		car2X += 600.0;
		car3X += 600.0;
		tyre1X -= 600.0;
		tyre2X -= 600.0;
	}
	
	if(x > car1X-car1W && x < car1X+car1W && y > car1Y-car1H && y < car1Y+car1H) gl_FragColor = vec4(0.85,0.3,0.4,1.0);
	if(x > car2X-car2W && x < car2X+car2W && y > car2Y-car2H && y < car2Y+car2H) gl_FragColor = vec4(0.85,0.3,0.4,1.0);
	if(x > car3X-car3W && x < car3X+car3W && y > car3Y-car3H && y < car3Y+car3H) gl_FragColor = vec4(0.2,0.6,0.9,1.0);
	if(tyre1X*tyre1X + tyre1Y*tyre1Y < tr*tr) gl_FragColor = vec4(0.3,0.3,0.5,1.0);
	if(tyre2X*tyre2X + tyre2Y*tyre2Y < tr*tr) gl_FragColor = vec4(0.3,0.3,0.5,1.0);
	// ==============End Road and Car===============
	
	
	// ==============UFO 2===============
	float gr = (3.0 + cos(frameNum*0.005)*0.05) * windowHeight * 0.01;
	// UFO 2 beam
	float ufogX = x-windowWidth*0.5 + cos(frameNum*0.05)*25.0 + 1250.0;
	float ufogY = y-windowHeight*0.5 + sin(frameNum*0.05)*5.0 + 113.0;// + a*50.0;
	
	// UFO 2
	float ufo2X = x-windowWidth*0.5 + cos(frameNum*0.05)*25.0 + 1250.0;
	float ufo2Y = y-windowHeight*0.5 + sin(frameNum*0.05)*5.0 - 5.0;// + a*50.0;
	if(frameNum < 1065.0){
		ufogX -= frameNum;
		ufo2X -= frameNum;
	}
	else {
		ufogX -= 1065.0;
		ufo2X -= 1065.0;
	}
	// Draw beam after 1030th frame
	if(frameNum > 1030.0){
		if (((ufogX*ufogX)/(2.0+(cos(frameNum*0.5))*0.25) + (ufogY*ufogY)/(30.0)) < gr*gr) {
			gl_FragColor[0] = 0.0+sin(frameNum*0.07);
			gl_FragColor[2] = 1.0;//1.0;
		}
	}
	// Print UFO2
	if(((ufo2X*ufo2X)/(1.6)) + ((ufo2Y*ufo2Y)/(0.7)) < ur*ur) gl_FragColor = vec4(0.79+(cos(frameNum*0.035)*0.095),0.35+(sin(frameNum*0.035)*0.095),0.67+(sin(frameNum*0.035)*0.0),1.0);
	if(((ufo2X*ufo2X)/(9.0)) + ((ufo2Y*ufo2Y)/(0.2)) < ur*ur) gl_FragColor = vec4(0.92+(sin(frameNum*0.035)*0.095),0.33+(cos(frameNum*0.035)*0.095),0.77,1.0);
	// ==============End UFO 2===============
	
	// Bottom grass
	if(y+80.0 < 5.0*cos(300.1*x + frameNum*1.0) + (windowHeight*0.5 + 1.0*sin(frameNum*0.1)) - 50.0) gl_FragColor = vec4(0.2+(cos(frameNum*0.035)-0.85),0.8,0.6,1.0);
	if(y+100.0 < 5.0*cos(300.1*x + frameNum*1.0) + (windowHeight*0.5 + 1.0*sin(frameNum*0.1)) - 50.0) gl_FragColor = vec4(0.2+(sin(frameNum*0.035)-0.85),0.85,0.6,1.0);
	if(y+140.0 < 5.0*cos(300.1*x + frameNum*1.0) + (windowHeight*0.5 + 1.0*sin(frameNum*0.1)) - 50.0) gl_FragColor = vec4(0.1+(cos(frameNum*0.035)-0.85),0.9,0.65,1.0);
	if(y+180.0 < 5.0*cos(300.1*x + frameNum*1.0) + (windowHeight*0.5 + 1.0*sin(frameNum*0.1)) - 50.0) gl_FragColor = vec4(0.1+(sin(frameNum*0.035)-0.85),0.9,0.7,1.0);
	if(y+220.0 < 5.0*cos(300.1*x + frameNum*1.0) + (windowHeight*0.5 + 1.0*sin(frameNum*0.1)) - 50.0) gl_FragColor = vec4(0.1+(cos(frameNum*0.035)-0.85),0.9,0.75,1.0);
	// End bottom grass
	
	// ==============Traffic Light===============
	float loopTR = mod((frameNum/250.0), 2.0);
	if( loopTR > 1.0 ){
	
		// Sign rod
		float sign1W = 6.0;
		float sign1H = 30.0;
		float sign1X = windowWidth*0.5 + 4500.0 - loopTR*3000.0;
		float sign1Y = windowHeight*0.5 - 110.0 + cos(frameNum*0.05);
	
		// Traffic light body
		float sign2W = 15.0;
		float sign2H = 35.0;
		float sign2X = windowWidth*0.5 + 4500.0 - loopTR*3000.0;
		float sign2Y = windowHeight*0.5 - 70.0 + 8.0 + cos(frameNum*0.05);
		
		// Traffic light body 2
		float sign3W = 15.0;
		float sign3H = 3.0;
		float sign3X = windowWidth*0.5 - 8.5 + 4500.0 - loopTR*3000.0;
		float sign3Y = windowHeight*0.5 - 70.0  + 38.0 + cos(frameNum*0.05);
		
		// Traffic light's light
		float sign4W = 3.5;
		float sign4H = 7.0;
		float sign4X = windowWidth*0.5 - 14.5 + 4500.0 - loopTR*3000.0;
		float sign4Y = windowHeight*0.5 - 70.0  + 28.0 + cos(frameNum*0.05);
	
		// Traffic light's body and rod
		if(x > sign1X-sign1W && x < sign1X+sign1W && y > sign1Y-sign1H && y < sign1Y+sign1H) gl_FragColor = vec4(0.55,0.55,0.55,1.0);
		if(x > sign2X-sign2W && x < sign2X+sign2W && y > sign2Y-sign2H && y < sign2Y+sign2H) gl_FragColor = vec4(0.35,0.35,0.35,1.0);
		
		// Traffic light's body 2
		if(x > sign3X-sign3W && x < sign3X+sign3W && y > sign3Y-sign3H && y < sign3Y+sign3H) gl_FragColor = vec4(0.35,0.35,0.35,1.0);
		if(x > sign3X-sign3W && x < sign3X+sign3W && y+22.0 > sign3Y-sign3H && y+22.0 < sign3Y+sign3H) gl_FragColor = vec4(0.35,0.35,0.35,1.0);
		if(x > sign3X-sign3W && x < sign3X+sign3W && y+44.0 > sign3Y-sign3H && y+44.0 < sign3Y+sign3H) gl_FragColor = vec4(0.35,0.35,0.35,1.0);
		
		// Traffic light's light
		if(x > sign4X-sign4W && x < sign4X+sign4W && y > sign4Y-sign4H && y < sign4Y+sign4H) gl_FragColor = vec4(1.0,0.1,0.1,1.0);
		if(x > sign4X-sign4W && x < sign4X+sign4W && y + 22.0 > sign4Y-sign4H && y + 22.0 < sign4Y+sign4H) gl_FragColor = vec4(1.0,1.0,0.1,1.0);
		if(x > sign4X-sign4W && x < sign4X+sign4W && y + 44.0 > sign4Y-sign4H && y + 44.0 < sign4Y+sign4H) gl_FragColor = vec4(0.1,1.0,0.1,1.0);
	}
	// ==============End Traffic Light===============
	
	// ==============RUN===============
	if(frameNum >  1300.0){
		// long vertical bar
		float wordW = 7.0;
		float wordH = 30.0;
	
		// short vertical bar
		float wordsvW = 7.0;
		float wordsvH = 15.0;
	
		// short horizontal bar
		float wordshW = 15.0;
		float wordshH = 7.0;
	
		// square
		float wordsW = 7.0;
		float wordsH = 7.0;
	
		// Position
		float wordX = windowWidth*0.5 - 380.0;
		float wordY = windowHeight*0.5 - 220.0 + sin(frameNum*0.05)*4.0;
	
		// R
		if(x > wordX-wordW && x < wordX+wordW && y > wordY-wordH && y < wordY+wordH) gl_FragColor = vec4(0.85,0.3,0.4,1.0);
		if(x - 18.0 > wordX-wordshW && x - 18.0 < wordX+wordshW && y > wordY-wordshH && y < wordY+wordshH) gl_FragColor = vec4(0.85,0.3,0.4,1.0);
		if(x - 18.0 > wordX-wordshW && x - 18.0 < wordX+wordshW && y - 23.0 > wordY-wordshH && y - 23.0 < wordY+wordshH) gl_FragColor = vec4(0.85,0.3,0.4,1.0);
		if(x - 26.0 > wordX-wordsvW && x - 26.0 < wordX+wordsvW && y - 10.0 > wordY-wordsvH && y - 10.0 < wordY+wordsvH) gl_FragColor = vec4(0.85,0.3,0.4,1.0);
		if(x - 18.0 > wordX-wordsW && x - 18.0 < wordX+wordsW && y + 12.0 > wordY-wordsH && y + 12.0 < wordY+wordsH) gl_FragColor = vec4(0.85,0.3,0.4,1.0);
		if(x - 25.0 > wordX-wordsW && x - 25.0 < wordX+wordsW && y + 24.0 > wordY-wordsH && y + 24.0 < wordY+wordsH) gl_FragColor = vec4(0.85,0.3,0.4,1.0);
	
		// U
		if(x - 60.0 > wordX-wordW && x - 60.0 < wordX+wordW && y > wordY-wordH && y < wordY+wordH) gl_FragColor = vec4(0.85,0.3,0.4,1.0);
		if(x - 87.0 > wordX-wordW && x - 87.0 < wordX+wordW && y > wordY-wordH && y < wordY+wordH) gl_FragColor = vec4(0.85,0.3,0.4,1.0);
		if(x - 70.0 > wordX-wordshW && x - 70.0 < wordX+wordshW && y + 23.0 > wordY-wordshH && y + 23.0 < wordY+wordshH) gl_FragColor = vec4(0.85,0.3,0.4,1.0);
	
		// N
		if(x - 120.0 > wordX-wordW && x - 120.0 < wordX+wordW && y > wordY-wordH && y < wordY+wordH) gl_FragColor = vec4(0.85,0.3,0.4,1.0);
		if(x - 131.0 > wordX-wordsW && x - 131.0 < wordX+wordsW && y - 6.0 > wordY-wordsH && y - 6.0 < wordY+wordsH) gl_FragColor = vec4(0.85,0.3,0.4,1.0);
		if(x - 142.0 > wordX-wordsW && x - 142.0 < wordX+wordsW && y + 6.0 > wordY-wordsH && y + 6.0 < wordY+wordsH) gl_FragColor = vec4(0.85,0.3,0.4,1.0);
		if(x - 155.0 > wordX-wordW && x - 155.0 < wordX+wordW && y > wordY-wordH && y < wordY+wordH) gl_FragColor = vec4(0.85,0.3,0.4,1.0);
	}
	// ==============End RUN===============
}