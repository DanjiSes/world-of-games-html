b:
	yarn build
	git add . & git commit -m "Build" & git pushß
	cp -R build/* ../../danjises.github.io/world-of-games/build/
	cd ../../danjises.github.io/world-of-games/build/ && git add . && git commit -m "Update - WoG" && git push

bm:
	yarn build:min
	git add . & git commit -m "Build" & git push
	cp -R build/* ../../danjises.github.io/world-of-games/build/
	cd ../../danjises.github.io/world-of-games/build/ && git add . && git commit -m "Update - WoG" && git push