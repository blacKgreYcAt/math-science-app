// D3.js Bubble Chart - Law Person Fund Flow Visualization

function createBubbleChart(data, onBubbleClick) {
    const container = document.querySelector('.bubble-chart');
    container.innerHTML = ''; // Clear previous chart

    if (!data || data.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: #b0b8c1;">無可用數據</p>';
        return;
    }

    // Chart dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 40, right: 40, bottom: 60, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select('.bubble-chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create main group
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xMin = d3.min(data, d => d.flow5d) - 50;
    const xMax = d3.max(data, d => d.flow5d) + 50;
    const yMin = d3.min(data, d => d.flow20d) - 100;
    const yMax = d3.max(data, d => d.flow20d) + 100;

    const xScale = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([chartHeight, 0]);

    const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => Math.abs(d.accelerationSpeed))])
        .range([15, 60]);

    // Grid lines
    g.append('g')
        .attr('class', 'grid-x')
        .attr('opacity', 0.1)
        .call(d3.axisBottom(xScale)
            .tickSize(chartHeight)
            .tickFormat('')
        );

    g.append('g')
        .attr('class', 'grid-y')
        .attr('opacity', 0.1)
        .call(d3.axisLeft(yScale)
            .tickSize(-chartWidth)
            .tickFormat('')
        );

    // Zero line (Y)
    g.append('line')
        .attr('x1', 0)
        .attr('x2', chartWidth)
        .attr('y1', yScale(0))
        .attr('y2', yScale(0))
        .attr('stroke', '#d4a844')
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0.3)
        .attr('stroke-width', 2);

    // Zero line (X)
    g.append('line')
        .attr('x1', xScale(0))
        .attr('x2', xScale(0))
        .attr('y1', 0)
        .attr('y2', chartHeight)
        .attr('stroke', '#d4a844')
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0.3)
        .attr('stroke-width', 2);

    // X Axis
    g.append('g')
        .attr('transform', `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale).ticks(8))
        .append('text')
        .attr('x', chartWidth / 2)
        .attr('y', 40)
        .attr('fill', '#b0b8c1')
        .attr('text-anchor', 'middle')
        .attr('font-size', '13px')
        .attr('font-weight', '600')
        .text('近5日法人資金流向（億）');

    // Y Axis
    g.append('g')
        .call(d3.axisLeft(yScale).ticks(8))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (chartHeight / 2))
        .attr('dy', '1em')
        .attr('fill', '#b0b8c1')
        .attr('text-anchor', 'middle')
        .attr('font-size', '13px')
        .attr('font-weight', '600')
        .text('資金流出（億）');

    // Axis style
    g.selectAll('.axis line, .axis path')
        .attr('stroke', '#2a3345')
        .attr('stroke-width', 1);

    g.selectAll('.axis text')
        .attr('fill', '#b0b8c1')
        .attr('font-size', '12px');

    // Create bubbles with tooltip
    const bubbles = g.selectAll('.bubble')
        .data(data, d => d.id)
        .enter()
        .append('circle')
        .attr('class', 'bubble')
        .attr('cx', d => xScale(d.flow5d))
        .attr('cy', d => yScale(d.flow20d))
        .attr('r', d => radiusScale(Math.abs(d.accelerationSpeed)))
        .on('click', function(event, d) {
            event.stopPropagation();
            // Highlight clicked bubble
            d3.selectAll('.bubble').attr('opacity', 0.5);
            d3.select(this).attr('opacity', 1);
            onBubbleClick(d);
        })
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('opacity', 1);

            // Show tooltip
            const tooltip = d3.select('body')
                .append('div')
                .attr('id', 'chart-tooltip')
                .style('position', 'absolute')
                .style('background', 'rgba(30, 35, 50, 0.95)')
                .style('color', '#ffffff')
                .style('padding', '12px 16px')
                .style('border-radius', '6px')
                .style('font-size', '13px')
                .style('z-index', '1000')
                .style('pointer-events', 'none')
                .style('border', '1px solid #2a3345')
                .html(`
                    <strong style="color: #d4a844;">${d.sector}</strong><br/>
                    近5日：${d.flow5d > 0 ? '+' : ''}${d.flow5d.toFixed(2)}億<br/>
                    近20日：${d.flow20d > 0 ? '+' : ''}${d.flow20d.toFixed(2)}億<br/>
                    資金加速度：${d.accelerationSpeed > 0 ? '+' : ''}${d.accelerationSpeed.toFixed(2)}億/天<br/>
                    <span style="display: inline-block; margin-top: 6px; padding: 4px 8px; background: rgba(212, 168, 68, 0.2); border-radius: 3px; color: #d4a844;">
                        ${d.fundStatus}
                    </span>
                `);

            tooltip
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 30) + 'px');
        })
        .on('mousemove', function(event) {
            d3.select('#chart-tooltip')
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 30) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('opacity', 0.85);

            d3.select('#chart-tooltip').remove();
        });

    // Add labels
    const labels = g.selectAll('.bubble-label')
        .data(data, d => d.id)
        .enter()
        .append('text')
        .attr('class', 'bubble-label')
        .attr('x', d => xScale(d.flow5d))
        .attr('y', d => yScale(d.flow20d))
        .attr('dy', '.35em')
        .text(d => d.sector.substring(0, 4))
        .on('click', function(event, d) {
            event.stopPropagation();
            onBubbleClick(d);
        });

    // Add zoom and pan
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoom);

    // Reset zoom on double-click
    svg.on('dblclick.zoom', () => {
        svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity.translate(margin.left, margin.top));
    });

    // Add legend
    const legendData = [
        { label: '主力', status: '主力' },
        { label: '輪動', status: '輪動' },
        { label: '觀望', status: '觀望' },
        { label: '退潮', status: '退潮' }
    ];

    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - 200}, 20)`);

    legendData.forEach((d, i) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(0, ${i * 24})`);

        legendRow.append('circle')
            .attr('r', 6)
            .attr('fill', '#d4a844')
            .attr('opacity', 0.7);

        legendRow.append('text')
            .attr('x', 15)
            .attr('y', 4)
            .attr('font-size', '12px')
            .attr('fill', '#b0b8c1')
            .text(d.label);
    });

    // Add axis labels background
    const axisLabelBg = g.append('rect')
        .attr('x', chartWidth + 10)
        .attr('y', chartHeight + 10)
        .attr('width', 140)
        .attr('height', 40)
        .attr('fill', 'rgba(30, 35, 50, 0.5)')
        .attr('rx', 4);

    g.append('text')
        .attr('x', chartWidth + 15)
        .attr('y', chartHeight + 30)
        .attr('font-size', '11px')
        .attr('fill', '#b0b8c1')
        .text('資金流出');

    g.append('text')
        .attr('x', chartWidth + 15)
        .attr('y', chartHeight + 45)
        .attr('font-size', '11px')
        .attr('fill', '#b0b8c1')
        .text('資金流入');
}

// Export for use in main.js
window.createBubbleChart = createBubbleChart;
