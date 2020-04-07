"use strict";
var context = document.querySelector("canvas").getContext("2d");
var Game = {
    Width: context.canvas.width,
    Height: context.canvas.height,
    Level: 1
};
var MainCircle = {
    X: Game.Width / 2,
    Y: Game.Height - 275,
    Radius: 30
};
var Circle = function (number) {
    this.X = Game.Width / 2;
    this.Y = 325;
    this.Text = number;
    this.Radius = 10;
    this.OfMainCircle = false;
    this.Angle = 45.5;
};

var circles = [];
var CountOfClick = 0;
var GameOver = false, GameWin = false;
var CircleR = 3;
var speed = 0.025;

for (var i = 0; i < 15; i++) { // 15 is count of circles
    circles.push(new Circle(i));
    circles[i].Y += i * 50; // subtracted of the y for each circle
}
window.onload = function () {
    // initial canvas
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.lineWidth = 1.5;
    // add click event
    context.canvas.addEventListener("click", function () {
        for (var i = 0; i < circles.length; i++) {
            var circle = circles[i];
            if (circles[CountOfClick] == circle || !circle.OfMainCircle) continue;
            if (circles[CountOfClick].X > circle.X - 27.5 && circles[CountOfClick].X < circle.X + 12.5 && circle.Y > Game.Height / 2) {
                // the circle collision
                GameOver = true;
                break;
            }
        }
        circles[CountOfClick].OfMainCircle = true;
        CountOfClick++;
        GameWin = CountOfClick == circles.length;
    });
    // update this function in all frames
    function Update() {
        // 'this' is context
        if (!GameOver && !GameWin) {
            this.fillStyle = "#fff";
        } else if (GameOver) {
            this.fillStyle = "#ff004a";
            if (CircleR > 0) {
                CircleR -= 0.15;
            }
        } else if (GameWin) {
            this.fillStyle = "#00ff31";
            CircleR += 0.15;
            if (speed > 0) {
                speed -= 0.00025;
            }
        }

        this.fillRect(0, 0, Game.Width, Game.Height);

        for (var i = 0; i < circles.length; i++) {
            var circle = circles[i];
            if (!circle.OfMainCircle) { // the circles are free 
                var Ytmp = circle.Y - CountOfClick * 50;
                this.beginPath();
                this.fillStyle = "#000";
                this.arc(circle.X, Ytmp, circle.Radius, 0, Math.PI * 2);
                this.fill();
                this.fillStyle = "#fff";
                this.font = "15px sans-serif";
                this.fillText((-circle.Text + circles.length).toString(), circle.X, Ytmp);
                this.closePath();
            } else { // the circle rotate to Main Circle
                circle.X = MainCircle.X + Math.cos(circle.Angle) * MainCircle.Radius * CircleR;
                circle.Y = MainCircle.Y + Math.sin(circle.Angle) * MainCircle.Radius * CircleR;
                circle.Angle += speed;
                this.beginPath();
                this.fillStyle = "#000";

                this.beginPath();
                this.moveTo(circle.X, circle.Y);
                this.lineTo(MainCircle.X, MainCircle.Y);
                this.stroke();
                this.closePath();

                this.arc(circle.X, circle.Y, circle.Radius, 0, Math.PI * 2);
                this.fill();
                this.fillStyle = "#fff";
                this.font = "15px sans-serif";
                this.fillText((-circle.Text + circles.length).toString(), circle.X, circle.Y);
                this.closePath();
            }
        }
        this.beginPath();
        this.fillStyle = "#000"; // color of MainCircle
        this.arc(MainCircle.X, MainCircle.Y, MainCircle.Radius, 0, Math.PI * 2); // Draw MainCircle in Center of Canvas
        this.fill();
        this.fillStyle = "#fff";
        this.font = "25px sans-serif";
        this.fillText(Game.Level.toString(), MainCircle.X, MainCircle.Y); // Show the player's level
        this.closePath();
    }
    function GameLoop() {
        Update.apply(context);
        window.setTimeout(GameLoop, 15); // 65 FPS
    }
    GameLoop();
};
