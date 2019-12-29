export class PresetShapeFactory {
    static defineShape(name, shape) {
        this.creators[name] = () => shape.clone();
    }
    createShape(name) {
        let shape = undefined;
        const creator = PresetShapeFactory.creators[name];
        if (creator !== undefined) {
            shape = creator();
        }
        else {
            console.log(`Not sure how to draw a ${name}.`);
        }
        return shape;
    }
}
PresetShapeFactory.creators = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlc2V0LXNoYXBlLWZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZHJhd2luZy9wcmVzZXQtc2hhcGUtZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLE9BQU8sa0JBQWtCO0lBR3BCLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBWSxFQUFFLEtBQVk7UUFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDOUMsQ0FBQztJQUVNLFdBQVcsQ0FBQyxJQUFZO1FBQzNCLElBQUksS0FBSyxHQUFzQixTQUFTLENBQUM7UUFDekMsTUFBTSxPQUFPLEdBQWdCLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvRCxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDdkIsS0FBSyxHQUFHLE9BQU8sRUFBRSxDQUFDO1NBQ3JCO2FBQU07WUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixJQUFJLEdBQUcsQ0FBQyxDQUFDO1NBQ2xEO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQzs7QUFmYywyQkFBUSxHQUFRLEVBQUUsQ0FBQyJ9