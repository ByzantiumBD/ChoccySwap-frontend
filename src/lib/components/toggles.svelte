<!-- If you want to use one of this toggles put the correct Id on the input

        <input type="checkbox" id="toggle" />

        <input type="checkbox" id="toggle-flex" />

        <input type="checkbox" id="toggle-inside" />

-->

<style lang="less">
	#toggle {
		--w: 50px;
		--h: 30px;
		all: unset;
		position: relative;
		width: var(--w);
		height: var(--h);
		background-color: #1a1a1a;
		border-radius: 30px;
		transition: all 0.25s ease;
		&::after {
			transition: all 0.25s ease;
			--r: 20px;
			content: '';
			position: absolute;
			width: calc(var(--r) * 2);
			height: calc(var(--r) * 2);
			background-color: gray;
			border-radius: 100%;
			left: calc(-1 * var(--r));
			top: calc(-1 * calc(var(--r) - calc(var(--h) / 2)));
		}
		&:checked {
			background-color: #ed32bf;
			&::after {
				left: calc(var(--w) + calc(-1 * var(--r)));
				top: calc(-1 * calc(var(--r) - calc(var(--h) / 2)));
				background-color: #ff9ced;
			}
		}
	}
	#toggle-flex {
		--w: 70px;
		--h: 30px;
		all: unset;
		display: flex;
		width: var(--w);
		height: var(--h);
		background-color: #1a1a1a;
		border-radius: 30px;
		justify-content: flex-start;
		align-items: center;
		transition: all 0.25s ease;
		&::after {
			transition: all 0.25s ease;
			content: '';
			width: 0px;
			height: 0px;
			background-color: gray;
			border: solid 20px gray;
			border-radius: 100%;
			box-sizing: content-box;
			margin-left: 0px;
		}
		&:checked {
			background-color: #ed32bf;
			&::after {
				content: '';
				margin-left: calc(var(--w) - 40px);
				border-color: #ff9ced;
			}
		}
	}
	#toggle-inside {
		--w: 60px;
		--h: 30px;
		all: unset;
		display: flex;
		width: var(--w);
		height: var(--h);
		background-color: #521542;
		border-radius: 30px;
		justify-content: flex-start;
		align-items: center;
		transition: all 0.25s ease;
		padding: 2px 8px;
		&::after {
			--r: 12px;
			transition: all 0.25s ease;
			content: '';
			width: calc(2 * var(--r));
			height: calc(2 * var(--r));
			background-color: gray;
			border-radius: 100%;
			margin-left: 0px;
			background-color: #ed32bf;
		}
		&:checked {
			background-color: #35727e;
			&::after {
				margin-left: calc(var(--w) - 2 * var(--r));
				content: '';
				background-color: #8eeafc;
			}
		}
	}
</style>
