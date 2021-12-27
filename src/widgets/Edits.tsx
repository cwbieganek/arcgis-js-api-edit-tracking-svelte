import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { init } from "@arcgis/core/core/watchUtils";
import Widget from '@arcgis/core/widgets/Widget';
import { tsx } from "@arcgis/core/widgets/support/widget";

interface AttributeChange {
	name: string;
	oldValue: any;
	newValue: any;
}

type EditType = 'geometry' | 'attribute';

interface Edit {
	type: EditType;
	moveDistance?: number;
	attributeChange?: AttributeChange;
}

interface State {
	edits: Edit[];
}

@subclass('esri.widgets.Edits')
class Edits extends Widget {
	@property()
	state: State;

	constructor(params?: any) {
		super(params);

		this.state = {
			edits: []
		}
	}

	addGeometryEdit(moveDistance: number): void {
		this.state.edits.push(
			{
				type: 'geometry',
				moveDistance: moveDistance
			}
		);
	}

	addAttributeEdit(name: string, oldValue: any, newValue: any): void {
		this.state.edits.push(
			{
				type: 'attribute',
				attributeChange: {
					name: name,
					oldValue: oldValue,
					newValue: newValue
				}
			}
		);
	}

	private renderEdit(edit: Edit, num: number) {
		return (
			<div>
				{edit.type} change (edit #{num}): {
				edit.type === 'geometry' ? 
				'Moved ' + edit.moveDistance.toString() : 
				edit.attributeChange.name + ' changed from ' + edit.attributeChange.oldValue + ' to ' + edit.attributeChange.newValue
				}
			</div>
		);
	}

	render() {
		return (
			<div>
				<div>Edits</div>
				{this.state.edits.map((edit, i) => {
					this.renderEdit(edit, i + 1);
				})}
			</div>
		);
	}
}

export default Edits;