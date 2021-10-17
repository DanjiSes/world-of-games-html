b:
	yarn build
	cp -R build/* ../../danjises.github.io/world-of-games/build/
	cd ../../danjises.github.io/world-of-games/build/ && git add . && git commit -m "Update - WoG" && git push