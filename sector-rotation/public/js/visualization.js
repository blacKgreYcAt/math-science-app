// D3.js Bubble Chart Visualization - Complete Implementation

function createBubbleChart(data, selectedStatus, onBubbleClick) {
    const container = document.querySelector('.bubble-chart');
    container.innerHTML = '';

    if (!data || data.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #a0aac1; padding: 40px;">無可用數據</p>';
        return;
    }

    // Chart dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 40, right: 60, bottom: 60, left: 100 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select('.bubble-chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Calculate scales
    const xMin = d3.min(data, d => d.flow5d) - 50;
    const xMax = d3.max(data, d => d.flow5d) + 50;
    const yMin = d3.min(data, d => d.accelerationSpeed) - 10;
    const yMax = d3.max(data, d => d.accelerationSpeed) + 10;

    const xScale = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([chartHeight, 0]);

    const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => Math.abs(d.flow20d))])
        .range([20, 80]);

    // Grid lines
    g.append('g')
        .attr('class', 'grid-y')
        .call(d3.axisLeft(yScale)
            .tickSize(-chartWidth)
            .tickFormat('')
        );

    g.append('g')
        .attr('class', 'grid-x')
        .attr('transform', `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale)
            .tickSize(-chartHeight)
            .tickFormat('')
        );

    // Zero lines
    g.append('line')
        .attr('x1', xScale(0))
        .attr('x2', xScale(0))
        .attr('y1', 0)
        .attr('y2', chartHeight)
        .attr('stroke', '#d4a844')
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0.3);

    g.append('line')
        .attr('x1', 0)
        .attr('x2', chartWidth)
        .attr('y1', yScale(0))
        .attr('y2', yScale(0))
        .attr('stroke', '#d4a844')
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0.3);

    // Axes
    g.append('g')
        .attr('transform', `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale).ticks(8))
        .append('text')
        .attr('x', chartWidth / 2)
        .attr('y', 40)
        .attr('fill', '#a0aac1')
        .attr('text-anchor', 'middle')
        .attr('font-size', '13px')
        .attr('font-weight', '600')
        .text('資金流入（億）');

    g.append('g')
        .call(d3.axisLeft(yScale).ticks(8))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (chartHeight / 2))
        .attr('dy', '1em')
        .attr('fill', '#a0aac1')
        .attr('text-anchor', 'middle')
        .attr('font-size', '13px')
        .attr('font-weight', '600')
        .text('加速流出（億/天）');

    // Style axes
    g.selectAll('.axis line, .axis path')
        .attr('stroke', '#2a3345')
        .attr('stroke-width', 1);

    g.selectAll('.axis text')
        .attr('fill', '#a0aac1')
        .attr('font-size', '12px');

    // Create bubbles
    const bubbles = g.selectAll('.bubble')
        .data(data, d => d.id)
        .enter()
        .append('circle')
        .attr('class', 'bubble')
        .attr('cx', d => xScale(d.flow5d))
        .attr('cy', d => yScale(d.accelerationSpeed))
        .attr('r', d => radiusScale(Math.abs(d.flow20d)))
        .attr('fill', d => d.color)
        .attr('opacity', 0.8)
        .on('click', function(event, d) {
            event.stopPropagation();
            d3.selectAll('.bubble').attr('opacity', 0.6);
            d3.select(this).attr('opacity', 1);
            onBubbleClick(d);
        })
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('opacity', 1);

            const tooltip = d3.select('body')
                .append('div')
                .attr('id', 'bubble-tooltip')
                .style('position', 'absolute')
                .style('background', 'rgba(15, 18, 25, 0.95)')
                .style('color', '#ffffff')
                .style('padding', '12px 16px')
                .style('border-radius', '6px')
                .style('font-size', '12px')
                .style('z-index', '1000')
                .style('pointer-events', 'none')
                .style('border', '1px solid #2a3345')
                .html(`
                    <strong style="color: #d4a844;">${d.sector}</strong><br/>
                    資金流入：${d.flow5d > 0 ? '+' : ''}${d.flow5d.toFixed(1)}億<br/>
                    20日累計：${d.flow20d > 0 ? '+' : ''}${d.flow20d.toFixed(1)}億<br/>
                    加速度：${d.accelerationSpeed > 0 ? '+' : ''}${d.accelerationSpeed.toFixed(2)}億/天
                `);

            tooltip
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 30) + 'px');
        })
        .on('mousemove', function(event) {
            d3.select('#bubble-tooltip')
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 30) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('opacity', 0.8);

            d3.select('#bubble-tooltip').remove();
        });

    // Labels
    g.selectAll('.bubble-label')
        .data(data, d => d.id)
        .enter()
        .append('text')
        .attr('class', 'bubble-label')
        .attr('x', d => xScale(d.flow5d))
        .attr('y', d => yScale(d.accelerationSpeed))
        .attr('dy', '.35em')
        .text(d => d.sector.substring(0, 3))
        .on('click', function(event, d) {
            event.stopPropagation();
            onBubbleClick(d);
        });

    // Zoom
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoom);

    // Double-click to reset
    svg.on('dblclick.zoom', () => {
        svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity.translate(margin.left, margin.top));
    });
}

window.createBubbleChart = createBubbleChart;
