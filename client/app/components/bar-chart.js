import Ember from 'ember';

/*globals d3 */
export default Ember.Component.extend({

    didInsertElement() {
 
        const that = this;

        const mapProp = function(d, prop) {
            return d.map(function(item) {
                return item[prop];
            });
        };

        const max = function(value, prop) {
            return d3.max(value, function(d) {
                return prop ? d[prop] : d;
            });
        };

        const scaleLinear = function(values) {
            return d3.scale.linear()
                .domain([values.startDomain, values.endDomain])
                .range([values.startRange, values.endRange]);
        };

        const scaleOrdinal = function(values) {
            const padding = values.padding || 0;
            const outerPadding = values.outerPadding || 0;
            return d3.scale.ordinal()
                .domain(values.domain)
                .rangeBands([values.startRange, values.endRange], padding, outerPadding);
        };

        const axis = function(prop, orient, ticks) {
            ticks = ticks || 10;
            return d3.svg.axis()
                .scale(prop)
                .ticks(ticks)
                .orient(orient);
        };

        const renderBarChart = function(values) {

            const container = d3.select(values.container);

            const tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    const val1 = d[values.dataKeys[0]];
                    const val2 = d[values.dataKeys[1]];
                    return '<strong>' + val1 + ':</strong> <span>  ' + val2.toLocaleString() + '</span>';
                });


            const svg = container.append('svg')
                .attr('width', values.outerWidth)
                .attr('height', values.outerHeigth);

            svg.call(tip);

            const barsContainer = svg.append('g')
                .attr('class', 'chart')
                .attr('transform', 'translate(' + values.marginL + ',' + values.marginT + ')');

            const bar = barsContainer.selectAll('g')
                .data(values.data)
                .enter().append('g')
                .attr('transform', function(d) {
                    const key = values.dataKeys[0];
                    return 'translate(' + values.getX(d[key]) + ',0)';
                })
                .attr('class', 'bar')
                .on('click', values.clickHandler)
                .on('mouseenter', tip.show)
                .on('mouseout', tip.hide);

            bar.append('rect')
                .attr('y', function(d) {
                    const key = values.dataKeys[1];
                    return values.getY(d[key]);
                })
                .attr('height', function(d) {
                    const key = values.dataKeys[1];
                    return values.height - values.getY(d[key]);
                })
                .attr('width', values.getX.rangeBand());

            barsContainer.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + values.height + ')')
                .call(axis(values.getX, 'bottom'));

            barsContainer.append('g')
                .attr('class', 'y axis')
                .call(axis(values.getY, 'left'));
        };


        const draw = function(data, container, action) {

            const margin = {
                    top: 50,
                    right: 20,
                    bottom: 40,
                    left: 90
                },
                outerWidth = 560,
                outerHeigth = 350;

            const width = outerWidth - margin.left - margin.right;
            const height = outerHeigth - margin.top - margin.bottom;

            const x = scaleOrdinal({
                domain: mapProp(data, 'planet').sort(),
                startRange: 0,
                endRange: width,
                padding: 0.1,
                outerPadding: 0.1
            });

            const y = scaleLinear({
                startDomain: 0,
                endDomain: max(data, 'radius'),
                startRange: height,
                endRange: 0
            });

            const doData = function(value) {
                return value.map(function(item) {
                    return {
                        planet: item.planet,
                        radius: parseFloat(item.radius)
                    };
                });
            };

            renderBarChart({
                data: doData(data),
                dataKeys: ['planet', 'radius'],
                container: container,
                marginL: margin.left,
                marginT: margin.top,
                width: width,
                height: height,
                outerWidth: outerWidth,
                outerHeigth: outerHeigth,
                getX: x,
                getY: y,
                clickHandler: action
            });
        };

        const clickHandler = function(d) {
            that.sendAction('clickHandler', d);
        };

        const planets = pls => {
            return pls.map((item) => {
                return {
                    radius: item.get('radius'),
                    planet: item.get('planet')
                };
            });
        };

        draw(planets(this.get('planets').toArray()), `#${this.$().attr('id')}`, clickHandler);
    }
});
